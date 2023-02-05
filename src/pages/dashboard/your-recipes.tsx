import { Menu } from "@headlessui/react";
import {
  BarsArrowUpIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  RectangleStackIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function YourRecipes() {
  return (
    <>
      <div
        className="fixed top-0 left-0 h-full w-1/2 bg-white"
        aria-hidden="true"
      />
      <div
        className="fixed top-0 right-0 h-full w-1/2 bg-gray-50"
        aria-hidden="true"
      />
      <div className="relative flex min-h-full flex-col">
        {/* 3 column wrapper */}
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex">
            {/* Account profile */}
            <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
              <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                      {/* Profile */}
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 flex-shrink-0">
                          <img
                            className="h-12 w-12 rounded-full"
                            src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                            alt=""
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            Debbie Lewis
                          </div>
                          <a
                            href="#"
                            className="group flex items-center space-x-2.5"
                          >
                            <svg
                              className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">
                              debbielewis
                            </span>
                          </a>
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row xl:flex-col">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 xl:w-full"
                        >
                          Create a new recipe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects List */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
                <div className="flex items-center">
                  <h1 className="flex-1 text-lg font-medium">Projects</h1>
                </div>
              </div>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200"
              >
                {projects.map((project) => (
                  <li
                    key={project.repo}
                    className="relative py-5 pl-4 pr-6 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
                  >
                    <div className="flex items-center justify-between space-x-4">
                      {/* Repo name and link */}
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-center space-x-3">
                          <span
                            className={classNames(
                              project.active ? "bg-green-100" : "bg-gray-100",
                              "flex h-4 w-4 items-center justify-center rounded-full"
                            )}
                            aria-hidden="true"
                          >
                            <span
                              className={classNames(
                                project.active ? "bg-green-400" : "bg-gray-400",
                                "h-2 w-2 rounded-full"
                              )}
                            />
                          </span>

                          <h2 className="text-sm font-medium">
                            <a href={project.href}>
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              {project.name}{" "}
                              <span className="sr-only">
                                {project.active ? "Running" : "Not running"}
                              </span>
                            </a>
                          </h2>
                        </div>
                        <a
                          href={project.repoHref}
                          className="group relative flex items-center space-x-2.5"
                        >
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.99917 0C4.02996 0 0 4.02545 0 8.99143C0 12.9639 2.57853 16.3336 6.15489 17.5225C6.60518 17.6053 6.76927 17.3277 6.76927 17.0892C6.76927 16.8762 6.76153 16.3104 6.75711 15.5603C4.25372 16.1034 3.72553 14.3548 3.72553 14.3548C3.31612 13.316 2.72605 13.0395 2.72605 13.0395C1.9089 12.482 2.78793 12.4931 2.78793 12.4931C3.69127 12.5565 4.16643 13.4198 4.16643 13.4198C4.96921 14.7936 6.27312 14.3968 6.78584 14.1666C6.86761 13.5859 7.10022 13.1896 7.35713 12.965C5.35873 12.7381 3.25756 11.9665 3.25756 8.52116C3.25756 7.53978 3.6084 6.73667 4.18411 6.10854C4.09129 5.88114 3.78244 4.96654 4.27251 3.72904C4.27251 3.72904 5.02778 3.48728 6.74717 4.65082C7.46487 4.45101 8.23506 4.35165 9.00028 4.34779C9.76494 4.35165 10.5346 4.45101 11.2534 4.65082C12.9717 3.48728 13.7258 3.72904 13.7258 3.72904C14.217 4.96654 13.9082 5.88114 13.8159 6.10854C14.3927 6.73667 14.7408 7.53978 14.7408 8.52116C14.7408 11.9753 12.6363 12.7354 10.6318 12.9578C10.9545 13.2355 11.2423 13.7841 11.2423 14.6231C11.2423 15.8247 11.2313 16.7945 11.2313 17.0892C11.2313 17.3299 11.3937 17.6097 11.8501 17.522C15.4237 16.3303 18 12.9628 18 8.99143C18 4.02545 13.97 0 8.99917 0Z"
                              fill="currentcolor"
                            />
                          </svg>
                          <span className="truncate text-sm font-medium text-gray-500 group-hover:text-gray-900">
                            {project.repo}
                          </span>
                        </a>
                      </div>
                      <div className="sm:hidden">
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </div>
                      {/* Repo meta info */}
                      <div className="hidden flex-shrink-0 flex-col items-end space-y-3 sm:flex">
                        <p className="flex items-center space-x-4">
                          <a
                            href={project.siteHref}
                            className="relative text-sm font-medium text-gray-500 hover:text-gray-900"
                          >
                            Visit site
                          </a>
                          <button
                            type="button"
                            className="relative rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">
                              {project.starred
                                ? "Add to favorites"
                                : "Remove from favorites"}
                            </span>
                            <StarIcon
                              className={classNames(
                                project.starred
                                  ? "text-yellow-300 hover:text-yellow-400"
                                  : "text-gray-300 hover:text-gray-400",
                                "h-5 w-5"
                              )}
                              aria-hidden="true"
                            />
                          </button>
                        </p>
                        <p className="flex space-x-2 text-sm text-gray-500">
                          <span>{project.tech}</span>
                          <span aria-hidden="true">&middot;</span>
                          <span>Last deploy {project.lastDeploy}</span>
                          <span aria-hidden="true">&middot;</span>
                          <span>{project.location}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
