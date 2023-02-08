import CreateRecipeForm from "@/components/recipes/form/CreateRecipeForm";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";

const CreateRecipe: NextPage = () => {
  return (
    <>
      <Head>
        <title>Body Fuel = Dashboard</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="min-h-screen bg-zinc-100 py-4 dark:bg-zinc-900">
        <CreateRecipeForm />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    // If no session exists, redirect the user to the login page.
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default CreateRecipe;
