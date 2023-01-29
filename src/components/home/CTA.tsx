import { signIn } from "next-auth/react";

export default function CTA() {
  return (
    <div className="bg-yellow-500">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-24 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-zinc-100">
            Start your free trial today.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <button
              onClick={() => signIn()}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-zinc-100 px-5 py-3 text-base font-medium text-zinc-900 hover:bg-zinc-200"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}