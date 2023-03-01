import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function HomeHero() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900">
      <div className="overflow-hidden  lg:relative lg:py-40">
        <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div>
            <div className="mt-12 sm:max-w-xl">
              <Image src="/logo.svg" width={125} height={125} alt="logo" />
              <h1 className="text-3xl font-bold tracking-tight text-yellow-500 sm:text-4xl">
                Welcome to Body Fuel!
              </h1>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
                Fuel your body, fuel your mind.
              </h2>
              <p className="mt-6 text-xl text-zinc-700 dark:text-zinc-300">
                Body Fuel is the ultimate recipe and nutrition tracking website.
                Create and share your favorite recipes, log your meals and
                workouts, and get personalized nutrition insights. Join our
                community of health-conscious individuals and take control of
                your wellness journey today!
              </p>
            </div>
            <div className="mt-6 sm:flex sm:w-full sm:max-w-lg">
              <div className="mt-4 sm:mt-0 ">
                <button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => signIn()}
                  className="block w-full rounded-md border border-transparent bg-yellow-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:px-10"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:mx-auto sm:max-w-3xl sm:px-6">
          <div className="py-12 sm:relative sm:mt-12 sm:py-16 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <div className="hidden sm:block lg:mt-0">
              <div className="absolute inset-y-0 left-1/2 w-screen rounded-l-3xl bg-zinc-300 dark:bg-zinc-700 lg:left-80 lg:right-0 lg:w-full" />
              <svg
                className="absolute top-8 right-1/2 -mr-3 lg:left-0 lg:m-0"
                width={404}
                height={392}
                fill="none"
                viewBox="0 0 404 392"
              >
                <defs>
                  <pattern
                    id="837c3e70-6c3a-44e6-8854-cc48c737b659"
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
                      className="text-zinc-200 dark:text-zinc-800"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width={404}
                  height={392}
                  fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
                />
              </svg>
            </div>
            <div className="relative -mr-40 pl-4 sm:mx-auto sm:max-w-3xl sm:px-0  lg:h-full lg:max-w-none lg:pl-12">
              <Image
                className="w-full rounded-md shadow-xl ring-1 ring-zinc-800 ring-opacity-5 dark:ring-zinc-600 lg:h-full lg:w-auto lg:max-w-none"
                src={
                  theme === "light"
                    ? "/img/light-dashboard.webp"
                    : "/img/dark-dashboard.webp"
                }
                alt="Body Fuel Dashboard"
                width={768}
                height={512}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
