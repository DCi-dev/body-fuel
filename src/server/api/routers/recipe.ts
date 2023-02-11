import { env } from "@/env/server.mjs";
import { AWS } from "@/lib/aws";
import { difficultyEnum, recipeSchema } from "@/types/zod-schemas";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const s3 = new AWS.S3();

const BUCKET_NAME = env.AWS_BUCKET_NAME;
const REGION = env.AWS_REGION;
const UPLOADING_TIME_LIMIT = 30;
const UPLOAD_MAX_FILE_SIZE = 1000000;

export const recipeRouter = createTRPCRouter({
  createRecipe: protectedProcedure
    .input(recipeSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      try {
        // check if the recipe slug already exists
        const existingRecipe = await ctx.prisma.recipe.findUnique({
          where: {
            slug: input.slug,
          },
        });

        let counter = 1;

        while (existingRecipe) {
          const newSlug = `${input.slug as string}-${counter}`;
          const newRecipe = await ctx.prisma.recipe.findUnique({
            where: {
              slug: newSlug,
            },
          });

          if (!newRecipe) {
            input.slug = newSlug;
            break;
          }

          counter++;
        }

        const recipe = await ctx.prisma.recipe.create({
          data: {
            name: input.name,
            slug: input.slug || "",
            description: input.description,
            servings: input.servings,
            image: "",
            ingredients: {
              create: input.ingredients.map((ingredient) => ({
                name: ingredient.name,
                quantity: ingredient.quantity,
                calories: ingredient.calories,
                protein: ingredient.protein,
                carbohydrates: ingredient.carbohydrates,
                fat: ingredient.fat,
              })),
            },
            // Add the total calories based on the ingredients calories field
            calories: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.calories !== undefined
                  ? acc + ingredient.calories
                  : acc,
              0
            ),
            protein: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.protein !== undefined
                  ? acc + ingredient.protein
                  : acc,
              0
            ),
            carbohydrates: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.carbohydrates !== undefined
                  ? acc + ingredient.carbohydrates
                  : acc,
              0
            ),
            fat: input.ingredients.reduce(
              (acc: number, ingredient) =>
                ingredient?.fat !== undefined ? acc + ingredient.fat : acc,
              0
            ),
            instructions: {
              create: input.instructions.map((instruction) => ({
                text: instruction.text,
              })),
            },
            shared: input.shared,
            category: input.category,
            prepTime: input.prepTime,
            cookTime: input.cookTime,
            difficulty: input.difficulty,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });

        const presignedUrl = s3.createPresignedPost({
          Bucket: BUCKET_NAME,
          Fields: {
            key: `${userId}/${recipe.id}`,
          },
          Expires: UPLOADING_TIME_LIMIT,
          Conditions: [
            ["content-length-range", 0, UPLOAD_MAX_FILE_SIZE],
            ["starts-with", "$Content-Type", "image/"],
          ],
        });

        // update image field with the presigned url
        await ctx.prisma.recipe.update({
          where: {
            id: recipe.id,
          },
          data: {
            image: `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${userId}/${recipe.id}`,
          },
        });

        https: return {
          presignedUrl,
          recipe,
        };
      } catch (error) {
        console.log(error);
      }
    }),

  getLimitedRecipes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const recipes = await ctx.prisma.recipe.findMany({
        take: limit + 1,
        where: {
          shared: true,
          name: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (recipes.length > limit) {
        const nextItem = recipes.pop();
        nextCursor = nextItem?.id;
      }

      const recipesWithDetails = await Promise.all(
        recipes.map(async (recipe) => {
          const ingredients = await ctx.prisma.ingredient.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const instructions = await ctx.prisma.instructions.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const user = await ctx.prisma.user.findUnique({
            where: {
              id: recipe.userId,
            },
          });

          return {
            ...recipe,
            ingredients,
            instructions,
            user,
          };
        })
      );

      return { recipesWithDetails, nextCursor };
    }),

  getLimitedFavoritedRecipes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const recipes = await ctx.prisma.recipe.findMany({
        take: limit + 1,
        where: {
          shared: true,
        },
        orderBy: {
          FavoriteRecipes: {
            _count: "desc",
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (recipes.length > limit) {
        const nextItem = recipes.pop();
        nextCursor = nextItem?.id;
      }

      const recipesWithDetails = await Promise.all(
        recipes.map(async (recipe) => {
          const ingredients = await ctx.prisma.ingredient.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const instructions = await ctx.prisma.instructions.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const user = await ctx.prisma.user.findUnique({
            where: {
              id: recipe.userId,
            },
          });

          return {
            ...recipe,
            ingredients,
            instructions,
            user,
          };
        })
      );

      return { recipesWithDetails, nextCursor };
    }),

  getUserFavoriteRecipe: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const favorite = await ctx.prisma.favoriteRecipes.findFirst({
        where: {
          userId: userId,
          recipeId: recipe.id,
        },
      });

      return favorite;
    }),

  getRecipes: publicProcedure.query(async ({ ctx }) => {
    const recipes = await ctx.prisma.recipe.findMany({
      where: {
        shared: true,
      },
    });
    // get all the recipes details from the database - shared recipes only
    const recipesWithDetails = await Promise.all(
      recipes.map(async (recipe) => {
        const ingredients = await ctx.prisma.ingredient.findMany({
          where: {
            recipeId: recipe.id,
          },
        });

        const instructions = await ctx.prisma.instructions.findMany({
          where: {
            recipeId: recipe.id,
          },
        });

        const user = await ctx.prisma.user.findUnique({
          where: {
            id: recipe.userId,
          },
        });

        return {
          ...recipe,
          ingredients,
          user,
          instructions,
        };
      })
    );

    return recipesWithDetails;
  }),
  getUserLimitedRecipes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const recipes = await ctx.prisma.recipe.findMany({
        take: limit + 1,
        where: {
          userId,
          name: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (recipes.length > limit) {
        const nextItem = recipes.pop();
        nextCursor = nextItem?.id;
      }

      const recipesWithDetails = await Promise.all(
        recipes.map(async (recipe) => {
          const ingredients = await ctx.prisma.ingredient.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const instructions = await ctx.prisma.instructions.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const user = await ctx.prisma.user.findUnique({
            where: {
              id: recipe.userId,
            },
          });

          return {
            ...recipe,
            ingredients,
            instructions,
            user,
          };
        })
      );

      return { recipesWithDetails, nextCursor };
    }),

  getRecipe: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const recipe = await ctx.prisma.recipe.findUnique({
      where: {
        slug: input,
      },
    });

    if (!recipe) {
      throw new Error("Recipe not found");
    }

    //  get the recipe with details from the database
    const ingredients = await ctx.prisma.ingredient.findMany({
      where: {
        recipeId: recipe.id,
      },
    });

    const instructions = await ctx.prisma.instructions.findMany({
      where: {
        recipeId: recipe.id,
      },
    });

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: recipe.userId,
      },
    });

    const reviews = await ctx.prisma.review.findMany({
      where: {
        recipeId: recipe.id,
      },
    });

    const reviewWithUserDetails = await Promise.all(
      reviews.map(async (review) => {
        const reviewUser = await ctx.prisma.user.findUnique({
          where: {
            id: review.userId,
          },
        });

        return {
          ...review,
          user: reviewUser,
        };
      })
    );

    return {
      ...recipe,
      ingredients,
      user,
      instructions,
      reviewWithUserDetails,
    };
  }),

  getUserFavoriteRecipesIds: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new Error("Not authenticated");
    }

    // get fav recipes ids
    const favRecipes = await ctx.prisma.favoriteRecipes.findMany({
      where: {
        userId,
      },
    });

    const favRecipesIds = favRecipes.map((favRecipe) => favRecipe.recipeId);

    return favRecipesIds;
  }),

  getLimitedUserFavoriteRecipes: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
        search: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("User not found");
      }
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const recipes = await ctx.prisma.recipe.findMany({
        take: limit + 1,
        where: {
          // Shared or created by user
          OR: [
            {
              userId: userId,
            },
            {
              shared: true,
            },
          ],
          FavoriteRecipes: {
            some: {
              userId: userId,
            },
          },
          name: {
            contains: input.search || "",
            mode: "insensitive",
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (recipes.length > limit) {
        const nextItem = recipes.pop();
        nextCursor = nextItem?.id;
      }

      const recipesWithDetails = await Promise.all(
        recipes.map(async (recipe) => {
          const ingredients = await ctx.prisma.ingredient.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const instructions = await ctx.prisma.instructions.findMany({
            where: {
              recipeId: recipe.id,
            },
          });

          const user = await ctx.prisma.user.findUnique({
            where: {
              id: recipe.userId,
            },
          });

          return {
            ...recipe,
            ingredients,
            instructions,
            user,
          };
        })
      );

      return { recipesWithDetails, nextCursor };
    }),

  deleteRecipe: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }
      // check if the recipe belongs to the user
      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input,
        },
      });

      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (recipe.userId !== userId) {
        throw new Error("You are not authorized to delete this recipe");
      }

      // delete the recipe
      const deletedRecipe = await ctx.prisma.recipe.delete({
        where: {
          id: input,
        },
      });

      await s3
        .deleteObject({
          Bucket: BUCKET_NAME,
          Key: `${userId}/${input}`,
        })
        .promise();

      return deletedRecipe;
    }),

  getRecipesByUser: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          userId: input,
        },
      });

      return recipes;
    }),
  getRecipesByDifficulty: publicProcedure
    .input(difficultyEnum)
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          difficulty: input,
        },
      });

      return recipes;
    }),
  getRecipesByPrepTime: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          prepTime: {
            lte: input,
          },
        },
      });

      return recipes;
    }),
  getRecipesByCookTime: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          cookTime: {
            lte: input,
          },
        },
      });

      return recipes;
    }),
  getRecipesByServings: publicProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      const recipes = await ctx.prisma.recipe.findMany({
        where: {
          servings: {
            lte: input,
          },
        },
      });

      return recipes;
    }),

  updateSharedRecipe: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        shared: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session?.user?.id;

      if (!userId) {
        throw new Error("Not authenticated");
      }

      // check if the recipe belongs to the user
      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: input.id,
        },
      });

      if (recipe?.userId !== userId) {
        throw new Error("You are not authorized to update this recipe");
      }

      // update the recipe
      const updatedRecipe = await ctx.prisma.recipe.update({
        where: {
          id: input.id,
        },
        data: {
          shared: input.shared,
        },
      });

      return updatedRecipe;
    }),
});
