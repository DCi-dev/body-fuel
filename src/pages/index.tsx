import CTA from "@/components/home/CTA";
import Feature from "@/components/home/Feature";
import FeaturedRecipes from "@/components/home/FeaturedRecipes";
import HomeHero from "@/components/home/Hero";
import LogoClouds from "@/components/home/LogoClouds";
import Testimonials from "@/components/home/Testimonials";
import { getServerAuthSession } from "@/server/auth";
import type { GetServerSideProps, NextPage } from "next";
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
        <Feature />
        <Testimonials />
        <FeaturedRecipes />
        <CTA />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    // If no session exists, redirect the user to the login page.
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default Home;
