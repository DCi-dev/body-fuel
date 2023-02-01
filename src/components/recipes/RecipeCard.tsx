interface RecipeCardProps {
  name: string;
  description: string;
  category: string;
  imageSrc: string;
  slug: string;
  userName: string;
  userImage: string;
}

export default function RecipeCard({
  name,
  description,
  category,
  imageSrc,
  slug,
  userName,
  userImage,
}: RecipeCardProps) {
  return (
    <div
      key={name}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      <div className="flex-shrink-0">
        <img className="h-48 w-full object-cover" src={imageSrc} alt={name} />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-zinc-100 p-6 dark:bg-zinc-700">
        <div className="flex-1">
          <div className="text-lg font-medium text-yellow-600 dark:text-yellow-400">
            <p className="hover:underline">{category}</p>
          </div>
          <a href={slug} className="mt-2 block">
            <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {name}
            </p>
            <p className="mt-3 text-base text-zinc-700 dark:text-zinc-300">
              {description}
            </p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <div>
              <span className="sr-only">{userName}</span>
              <img className="h-10 w-10 rounded-full" src={userImage} alt="" />
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {userName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
