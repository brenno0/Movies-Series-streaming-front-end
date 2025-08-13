'use client'

import * as React from 'react'
import { Link } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import type { INavigationMenuProps, ITopNavCategories } from '@/types'

const getMainCategoryItem = ({ item }: { item: ITopNavCategories }) => {
  return item.categoryItems.find(
    (categoryItem) => categoryItem.mainItem === true,
  )
}

export function NavigationMenuComponent({
  items,
}: Readonly<INavigationMenuProps>) {
  return (
    <NavigationMenu viewport={false} className="z-999999 w-full">
      <NavigationMenuList>
        {items.map((item) => {
          return (
            <NavigationMenuItem key={item.categoryTitle}>
              <NavigationMenuTrigger className="bg-transparent">
                {item.categoryTitle}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  {item.categoryItems.findIndex(
                    (categoryItem) => categoryItem.mainItem === true,
                  ) !== -1 && (
                    <ListItem
                      href={getMainCategoryItem({ item })?.href as string}
                      title={getMainCategoryItem({ item })?.title}
                      className="row-span-3"
                    >
                      <p className="text-md mt-4">
                        {getMainCategoryItem({ item })?.description}
                      </p>
                    </ListItem>
                  )}
                  {item.categoryItems
                    .filter((categoryItem) => categoryItem.mainItem !== true)
                    .map((categoryItem) => (
                      <ListItem
                        key={categoryItem.title}
                        href={categoryItem.href}
                        title={categoryItem.title}
                        className="row-span-3"
                      >
                        <p className="text-md mt-4">
                          {categoryItem.description}
                        </p>
                      </ListItem>
                    ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
