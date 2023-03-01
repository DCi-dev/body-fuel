import { sessionRoutes } from "@/utils/sessionRoutes";
import { Lato } from "@next/font/google";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import Footer from "./Footer";
import Navbar from "./Navbar";

import { Dialog, Switch, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useEffect, useRef, useState } from "react";
import UserMenu from "./UserMenu";

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export default function Layout({ children }: { children: React.ReactNode }) {
  // Session
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: sessionData } = useSession();

  //  Active navlink
  const router = useRouter();
  const navRef = useRef<HTMLDivElement | null>(null);

  // Theme
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        async
        defer
        data-website-id="5769784c-0d00-42be-ac4c-9a622632084c"
        src="https://umami.cdi.dev/umami.js"
      />
      {/* No session */}
      {!sessionData ? (
        <div className="flex min-h-screen flex-col justify-start bg-zinc-100 dark:bg-zinc-900">
          <header>
            <Navbar
              theme={theme as string}
              setTheme={setTheme}
              router={router}
              navRef={navRef}
            />
          </header>
          <main
            className={`${lato.className} max-w-screen mt-16 overflow-hidden font-sans`}
          >
            {children}
          </main>
          <footer className="mt-auto">
            <Footer />
          </footer>
        </div>
      ) : (
        <div
          className={`${lato.className} max-w-screen h-full overflow-hidden font-sans`}
        >
          {/* Session Layout */}

          <Transition.Root show={sidebarOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 md:hidden"
              onClose={setSidebarOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-zinc-400 bg-opacity-75 dark:bg-zinc-600" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-zinc-200 dark:bg-zinc-800">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-300"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                          type="button"
                          className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-100 dark:focus:bg-zinc-900"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <span className="sr-only">Close sidebar</span>
                          <XMarkIcon
                            className="h-6 w-6 text-zinc-900 dark:text-zinc-100"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                      <div className="flex flex-shrink-0 items-center justify-between px-4">
                        <Image
                          className="h-8 w-auto"
                          src="/logo.svg"
                          alt="Body Fuel Logo"
                          width={32}
                          height={32}
                        />
                        <Switch
                          checked={theme === "light"}
                          onChange={() =>
                            setTheme(theme === "light" ? "dark" : "light")
                          }
                          className={`${
                            theme == "light" ? "bg-zinc-400" : "bg-zinc-700"
                          } relative ml-6 inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Theme mode</span>
                          <span
                            className={`${
                              theme == "light"
                                ? "translate-x-1 bg-zinc-100"
                                : "translate-x-6 bg-zinc-400"
                            } inline-block h-4 w-4 transform rounded-full transition`}
                          />
                        </Switch>
                      </div>
                      <nav className="mt-5 space-y-1 px-2">
                        {sessionRoutes.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              router.asPath === item.href
                                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                                : "text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100",
                              "group flex items-center rounded-md px-2 py-2 text-base font-medium"
                            )}
                          >
                            <item.icon
                              className={classNames(
                                router.asPath === item.href
                                  ? "text-zinc-700 dark:text-zinc-300"
                                  : "text-zinc-600 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                                "mr-4 h-6 w-6 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                          </Link>
                        ))}
                      </nav>
                    </div>
                    <UserMenu
                      userName={sessionData?.user?.name as string}
                      userImage={sessionData?.user?.image as string}
                    />
                  </Dialog.Panel>
                </Transition.Child>
                <div className="w-14 flex-shrink-0">
                  {/* Force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Static sidebar for desktop */}
          <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            <div className="flex min-h-0 flex-1 flex-col bg-zinc-200 dark:bg-zinc-800">
              <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <div className="flex flex-shrink-0 items-center justify-between px-4">
                  <Image
                    className="h-8 w-auto"
                    src="/logo.svg"
                    alt="Body Fuel Logo"
                    width={32}
                    height={32}
                  />
                  <Switch
                    checked={theme === "light"}
                    onChange={() =>
                      setTheme(theme === "light" ? "dark" : "light")
                    }
                    className={`${
                      theme == "light" ? "bg-zinc-400" : "bg-zinc-700"
                    } relative ml-6 inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Theme mode</span>
                    <span
                      className={`${
                        theme == "light"
                          ? "translate-x-1 bg-zinc-100"
                          : "translate-x-6 bg-zinc-400"
                      } inline-block h-4 w-4 transform rounded-full transition`}
                    />
                  </Switch>
                </div>
                <nav className="mt-5 flex-1 space-y-1 px-2">
                  {sessionRoutes.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        router.asPath === item.href
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                          : "text-zinc-700 hover:bg-zinc-300 hover:text-zinc-900  dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-zinc-100",
                        "group flex items-center rounded-md px-2 py-2 text-sm font-medium"
                      )}
                    >
                      <item.icon
                        className={classNames(
                          router.asPath === item.href
                            ? "text-zinc-700 dark:text-zinc-300"
                            : "text-zinc-600 group-hover:text-zinc-700 dark:text-zinc-400 dark:group-hover:text-zinc-300",
                          "mr-3 h-6 w-6 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <UserMenu
                userName={sessionData?.user?.name as string}
                userImage={sessionData?.user?.image as string}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col md:pl-64">
            <div className="sticky top-0 z-10 bg-zinc-200 pl-1 pt-1 dark:bg-zinc-800 sm:pl-3 sm:pt-3 md:hidden">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500 dark:hover:text-zinc-100"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      )}
    </>
  );
}
