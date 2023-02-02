import Image from "next/image";

interface Props {
  name: string;
  description: string;
  category: string;
  imageSrc: string;
  userName: string;
  userImage: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servings: number;
  prepTime: string;
  cookTime: string;
  difficulty: string;
}

export default function RecipePageHero({
  name,
  description,
  category,
  imageSrc,
  userName,
  userImage,
  calories,
  protein,
  fat,
  carbs,
  servings,
  prepTime,
  cookTime,
  difficulty,
}: Props) {
  return (
    <div className="relative bg-zinc-100 pt-2 pb-16 dark:bg-zinc-900 sm:pb-24">
      <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:items-start lg:gap-24 lg:px-8">
        <div className="relative sm:py-16 lg:py-0">
          <div
            aria-hidden="true"
            className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen"
          >
            <div className="absolute inset-y-0 right-1/2 w-full rounded-r-3xl bg-zinc-50 dark:bg-zinc-800 lg:right-72" />
            <svg
              className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392"
            >
              <defs>
                <pattern
                  id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-zinc-200 dark:text-zinc-700"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={392}
                fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
              />
            </svg>
          </div>
          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
            {/* Testimonial card*/}
            <div className="relative overflow-hidden rounded-2xl pt-64 pb-10 shadow-xl">
              <Image
                className="absolute inset-0 h-full w-full object-cover"
                src={imageSrc}
                alt={name}
                width={522}
                height={296}
              />
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
          {/* Content area */}
          <div className="pt-12 sm:pt-16 lg:pt-6">
            <h2 className="font-semibold leading-6 text-yellow-500">
              {category}
            </h2>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              {name}
            </h1>
            <div className="mt-6 space-y-6 text-zinc-700 dark:text-zinc-300">
              <p className="text-lg">{description}</p>
            </div>
          </div>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <div>
                <span className="sr-only">{userName}</span>
                <Image
                  className="h-10 w-10 rounded-full"
                  src={userImage}
                  alt={userName}
                  width={40}
                  height={40}
                />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {userName}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
              <div className="border-t-2 border-zinc-200 pt-6 dark:border-zinc-800">
                <dt className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Difficulty
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {difficulty ? difficulty : "*"}
                </dd>
              </div>
              <div className="border-t-2 border-zinc-200 pt-6 dark:border-zinc-800">
                <dt className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Number of servings
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {servings}
                </dd>
              </div>
              <div className="border-t-2 border-zinc-200 pt-6 dark:border-zinc-800">
                <dt className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Prep time
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {prepTime ? prepTime : "*"}
                </dd>
              </div>
              <div className="border-t-2 border-zinc-200 pt-6 dark:border-zinc-800">
                <dt className="text-base font-medium text-zinc-700 dark:text-zinc-300">
                  Cook time
                </dt>
                <dd className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {cookTime ? cookTime : "*"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* Nutrition */}
      <div className="mt-16 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Nutrition
            </h2>
            <p className="my-3 text-xl text-zinc-700 dark:text-zinc-300 sm:mt-4">
              A healthy recipe should be balanced and have all the nutrients
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <dl className="rounded-lg bg-zinc-50 shadow-lg dark:bg-zinc-800 sm:grid sm:grid-cols-4">
                <div className="flex flex-col border-b border-zinc-200 p-6 text-center dark:border-zinc-700 sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                    Calories
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-yellow-500">
                    {calories ? calories : "*"}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-b border-zinc-200 p-6 text-center dark:border-zinc-700 sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                    Protein
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-yellow-500">
                    {protein ? protein : "*"}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-zinc-200 p-6 text-center dark:border-zinc-700 sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                    Carbs
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-yellow-500">
                    {carbs ? carbs : "*"}
                  </dd>
                </div>
                <div className="flex flex-col border-t border-zinc-200 p-6 text-center dark:border-zinc-700 sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-zinc-700 dark:text-zinc-300">
                    Fats
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-yellow-500">
                    {fat ? fat : "*"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
