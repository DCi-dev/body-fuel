import HomeHero from "@/components/home/Hero";
import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Body Fuel</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <main>
        <HomeHero />
      </main>
    </>
  );
};

export default Home;
