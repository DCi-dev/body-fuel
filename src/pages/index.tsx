import HomeHero from "@/components/home/Hero";
import LogoClouds from "@/components/home/LogoClouds";
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
        <LogoClouds />
      </main>
    </>
  );
};

export default Home;
