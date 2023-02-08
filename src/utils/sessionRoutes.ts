import { DocumentIcon, HomeIcon, PencilIcon } from "@heroicons/react/24/outline";

export const sessionRoutes = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Recipes",
    href: "/dashboard/recipes",
    icon: DocumentIcon,
  },
  {
    name: "Create Recipe",
    href: "/dashboard/create-recipe",
    icon: PencilIcon,
  },
];
