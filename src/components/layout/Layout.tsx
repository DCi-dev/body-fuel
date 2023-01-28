import { Lato } from "@next/font/google";
import Head from "next/head";

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});
// import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex min-h-screen flex-col justify-start">
        <header><Navbar /></header>
        <main className={`${lato.className} font-sans`}>{children}</main>
        <footer className="mt-auto">{/* <Footer /> */}</footer>
      </div>
    </>
  );
}
