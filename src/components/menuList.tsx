import { Link, useMatchRoute } from "@tanstack/react-router";
import React from "react";
import { cn } from "../lib/utils";

export type ItemType = {
  label: string;
  path: string;
};

export interface MenuListProps {
  items: ItemType[];
  wrapperClassName?: string;
  ulClassName?: string;
}

const MenuList: React.FC<MenuListProps> = ({
  items = [],
  wrapperClassName,
  ulClassName,
}) => {
  const match = useMatchRoute();

  return (
    <nav className={cn("border-b flex-none", wrapperClassName)}>
      <ul className={cn("list-none flex gap-12 h-full", ulClassName)}>
        {items.map((tab) => {
          const isActive = match({ to: tab.path });

          return (
            <li key={tab.label}>
              <Link
                to={tab.path}
                className={cn(
                  "block py-2 px-3 text-sm border-b-2",
                  isActive
                    ? "text-black border-black"
                    : "text-neutral-500 border-transparent"
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MenuList;
