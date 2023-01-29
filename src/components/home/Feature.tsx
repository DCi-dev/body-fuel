import {
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Create and share your favorite recipes with our community.",
    description:
      "Join a community of like-minded individuals and get inspiration for new recipes and meal ideas.",
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    name: "Keep track of your nutrition",
    description:
      "Log your meals and workouts to see how they impact your nutrition",
    icon: HeartIcon,
  },
  {
    name: "Get the most out of your workouts",
    description:
      "Take control of your nutrition and fuel your body and mind in the best way possible",
    icon: BoltIcon,
  },
];

export default function Feature() {
  return (
    <div>
      <div className="relative overflow-hidden bg-zinc-100 pt-16 dark:bg-zinc-900 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
          <div>
            <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
              Everything you need to
            </p>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight text-zinc-900
          dark:text-zinc-100 sm:text-4xl"
            >
              Fuel your body, fuel your mind.
            </h2>
          </div>
          <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
            <img
              className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
              src="https://tailwindui.com/img/component-images/top-nav-with-multi-column-layout-screenshot.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="bg-zinc-100 py-12 dark:bg-zinc-900">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">A better way to send money.</h2>
          <dl className="space-y-10 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            {features.map((feature) => (
              <div key={feature.name}>
                <dt>
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-yellow-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-lg font-bold leading-6 text-zinc-900 dark:text-zinc-100">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
