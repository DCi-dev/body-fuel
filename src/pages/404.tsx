import Head from "next/head";
import Link from "next/link";

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>Body Fuel - 404</title>
        <meta name="description" content="Healthy Lifestyle" />
      </Head>
      <div className="min-h-full bg-zinc-100 px-4 py-32 dark:bg-zinc-900 sm:px-6 sm:py-40 md:grid md:place-items-center lg:px-8">
        <div className="mx-auto max-w-max">
          <main className="sm:flex">
            <p className="text-4xl font-bold tracking-tight text-yellow-600 sm:text-5xl">
              404
            </p>
            <div className="sm:ml-6">
              <div className="sm:border-l sm:border-zinc-200 sm:pl-6">
                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                  Page not found
                </h1>
                <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
                  Please check the URL in the address bar and try again.
                </p>
                <p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
                  The page might not exist or you might not have permission to
                  view it.
                </p>
              </div>
              <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Go back home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
