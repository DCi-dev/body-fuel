import Form from "@/components/test/Form";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";

const Dashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Body Fuel = Dashboard</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="mt-28">
        <div>
          <Form />
        </div>
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

export default Dashboard;
