import type { Instruction } from "@/types";

export default function Instructions({ instructions }: { instructions: Instruction[] }) {
  return (
    <div className="bg-zinc-100 py-12 px-4 dark:bg-zinc-900">
      <div className="flow-root lg:mx-auto lg:max-w-7xl">
        <div className="mb-12 sm:flex-auto">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Instructions
          </h2>
          <p className="my-3 text-xl text-zinc-700 dark:text-zinc-300 sm:mt-4">
            Here are the instructions to make this recipe.
          </p>
        </div>
        <ul role="list" className="mb-8">
          {instructions.map((instruction, index) => (
            <li key={instruction.id}>
              <div className="relative pb-8">
                {index !== instructions.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-zinc-200 dark:bg-zinc-800"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-center space-x-3">
                  <div>
                    <span
                      className={
                        "flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
                      }
                    >
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5 pl-1">
                    <div>
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
                        {instruction.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
