import { navigationRoutes } from "@utils/navigationRoutes";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import { Disclosure, Menu, Switch, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import type { NextRouter } from "next/router";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type NavRefType = React.RefObject<HTMLDivElement> | null;

interface NavbarProps {
  theme: string;
  setTheme: (theme: string) => void;
  router: NextRouter;
  navRef: NavRefType;
}

export default function Navbar({
  theme,
  setTheme,
  router,
  navRef,
}: NavbarProps) {
  // Session
  const { data: sessionData } = useSession();
  const userProfileImageUrl = sessionData?.user?.image as string;

  async function handleSignIn() {
    await signIn();
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <Disclosure
      as="nav"
      className="fixed z-50 w-screen bg-zinc-200 dark:bg-zinc-800"
    >
      {({ open }) => (
        <nav ref={navRef}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    className="block h-8 w-auto lg:hidden"
                    src="/logo.svg"
                    alt="Body Fuel"
                    width={32}
                    height={32}
                    priority
                  />
                  <Image
                    className="hidden h-8 w-auto lg:block"
                    src="/logo.svg"
                    alt="Body Fuel"
                    width={32}
                    height={32}
                    priority
                  />
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigationRoutes.map((link, index) => (
                      <NavItem
                        key={index}
                        href={`/${link}`}
                        text={link}
                        router={router}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center">
                  <div className="py-16">
                    <Switch
                      checked={theme === "light"}
                      onChange={() =>
                        setTheme(theme === "light" ? "dark" : "light")
                      }
                      className={`${
                        theme == "light" ? "bg-zinc-400" : "bg-zinc-700"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
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
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-800 dark:bg-zinc-800">
                        <span className="sr-only">Open user menu</span>
                        {sessionData ? (
                          <Image
                            src={userProfileImageUrl || "/no-user-image.jpg"}
                            className="h-8 w-8 rounded-full"
                            aria-hidden="true"
                            alt="profile image"
                            width={30}
                            height={30}
                          />
                        ) : (
                          <UserCircleIcon
                            className="h-8 w-8 rounded-full"
                            aria-hidden="true"
                          />
                        )}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-zinc-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700">
                        {sessionData && (
                          <>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/dashboard"
                                  className={classNames(
                                    active ? "bg-white dark:bg-zinc-600" : "",
                                    "block px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                  )}
                                >
                                  Dashboard
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/dashboard/your-recipes"
                                  className={classNames(
                                    active ? "bg-white dark:bg-zinc-600" : "",
                                    "block px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                  )}
                                >
                                  Your recipes
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/dashboard/create-recipe"
                                  className={classNames(
                                    active ? "bg-white dark:bg-zinc-600" : "",
                                    "block px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                  )}
                                >
                                  Create a recipe
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  href="/dashboard/favorite-recipes"
                                  className={classNames(
                                    active ? "bg-white dark:bg-zinc-600" : "",
                                    "block px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                                  )}
                                >
                                  Favourite recipes
                                </Link>
                              )}
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active ? "bg-white dark:bg-zinc-600" : "",
                                "block cursor-pointer px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100"
                              )}
                              onClick={
                                sessionData
                                  ? () => void handleSignOut()
                                  : () => void handleSignIn()
                              }
                            >
                              {sessionData ? "Sign out" : "Sign in"}
                            </div>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="hover-text-black inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="border-t border-zinc-300 dark:border-zinc-700 sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigationRoutes.map((link, index) => (
                <MobileItem
                  key={index}
                  href={`/${link}`}
                  text={link}
                  router={router}
                />
              ))}
            </div>
            <div className="border-t border-zinc-300 pt-4 pb-3 dark:border-zinc-700">
              <div className="flex items-center px-5">
                {sessionData && (
                  <>
                    <div className="flex-shrink-0">
                      <Image
                        src={userProfileImageUrl || "/no-user-image.jpg"}
                        className="h-10 w-10 rounded-full"
                        alt="profile image"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                        {sessionData?.user?.name as string}
                      </div>
                      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {sessionData?.user?.email as string}
                      </div>
                    </div>
                  </>
                )}
                {!sessionData && (
                  <>
                    <Disclosure.Button
                      as="button"
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                      <button onClick={() => void handleSignIn()}>
                        Sign in
                      </button>
                    </Disclosure.Button>
                  </>
                )}
                <Switch
                  checked={theme === "light"}
                  onChange={() =>
                    setTheme(theme === "light" ? "dark" : "light")
                  }
                  className={`${
                    theme == "light" ? "bg-zinc-400" : "bg-zinc-700"
                  } relative ml-auto inline-flex h-6 w-11 items-center rounded-full`}
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
              <div className="mt-3 space-y-1 px-2">
                {sessionData && (
                  <>
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard"
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                      Dashboard
                    </Disclosure.Button>

                    <Disclosure.Button
                      as={Link}
                      href="/dashboard/your-recipes"
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                      Your recipes
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard/create-recipe"
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                      Create a recipe
                    </Disclosure.Button>
                    <Disclosure.Button
                      as={Link}
                      href="/dashboard/favorite-recipes"
                      className="block rounded-md px-3 py-2 text-base font-medium text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white"
                    >
                      Favorite recipes
                    </Disclosure.Button>
                  </>
                )}
              </div>
            </div>
          </Disclosure.Panel>
        </nav>
      )}
    </Disclosure>
  );
}

function NavItem({
  href,
  text,
  router,
}: {
  href: string;
  text: string;
  router: NextRouter;
}) {
  const isActive = router.asPath === (href === "/home" ? "/" : href);
  return (
    <Link
      href={href === "/home" ? "/" : href}
      passHref
      className={`${
        isActive
          ? " bg-zinc-300 text-black dark:bg-zinc-900  dark:text-white"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
      } rounded-md py-2 px-3  text-sm  font-medium`}
    >
      <span className="capitalize">{text}</span>
    </Link>
  );
}

function MobileItem({
  href,
  text,
  router,
}: {
  href: string;
  text: string;
  router: NextRouter;
}) {
  const isActive = router.asPath === (href === "/home" ? "/" : href);
  return (
    <Disclosure.Button
      as={Link}
      href={href === "/home" ? "/" : href}
      passHref
      className={`${
        isActive
          ? " bg-zinc-300 text-black dark:bg-zinc-900  dark:text-white"
          : "text-zinc-700 hover:bg-zinc-100 hover:text-black dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
      } block rounded-md py-2 px-3  text-base  font-medium`}
    >
      <span className="capitalize">{text}</span>
    </Disclosure.Button>
  );
}
