import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Body Fuel</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main className="h-screen bg-white dark:bg-black"></main>
    </>
  );
};

export default Home;
