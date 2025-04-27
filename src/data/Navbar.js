import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
export const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Profile",
      link: "/profile",
      icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
    },
  ];