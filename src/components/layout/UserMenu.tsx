/* This example requires Tailwind CSS v2.0+ */
import { Menu, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface UserMenuProps {
  userName: string;
  userImage: string;
}

export default function UserMenu({ userName, userImage }: UserMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-300  dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">
          <div className="group block w-full flex-shrink-0">
            <div className="flex items-center justify-start">
              <div>
                <Image
                  className="inline-block h-9 w-9 rounded-full"
                  src={userImage}
                  alt={userName}
                  width={36}
                  height={36}
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {userName}
                </p>
              </div>
              <ChevronRightIcon
                className="-mr-1 ml-auto h-4 w-4"
                aria-hidden="true"
              />
            </div>
          </div>
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
        <Menu.Items className="dark:ring-zing-100 absolute bottom-14 right-1 z-10 mt-2 w-56 origin-bottom-right rounded-md bg-zinc-100 shadow-lg ring-1 ring-zinc-900 ring-opacity-5 focus:outline-none dark:bg-zinc-900">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onClick={() => signOut()}
                  className={classNames(
                    active
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300",
                    "block w-full px-4 py-2 text-left text-sm",
                  )}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
