import { DocumentIcon, HomeIcon } from "@heroicons/react/24/outline";

export const sessionRoutes = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Recipes",
    href: "/dashboard/your-recipes",
    icon: DocumentIcon,
  },
];
