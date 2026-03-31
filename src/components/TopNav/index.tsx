'use client'

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

const isDropdownCategory = (item: ITopNavCategories) =>
  item.categoryItems.length > 1

export function NavigationMenuComponent({
  items,
}: Readonly<INavigationMenuProps>) {
  return (
    <NavigationMenu viewport={false} className="z-999999 w-full">
      <NavigationMenuList className="gap-0">
        {items.map((item) => {
          // Single-item categories → flat nav link (no dropdown)
          if (!isDropdownCategory(item)) {
            const target = item.categoryItems[0]
            return (
              <NavigationMenuItem key={item.categoryTitle}>
                <NavigationMenuLink asChild>
                  <Link
                    to={target.href as any}
                    className="inline-flex h-9 items-center px-4 py-2 text-sm font-medium text-white/55 hover:text-white transition-colors rounded-md"
                  >
                    {item.categoryTitle}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          }

          // Multi-item categories (Gêneros) → dropdown
          return (
            <NavigationMenuItem key={item.categoryTitle}>
              <NavigationMenuTrigger className="bg-transparent text-white/55 hover:text-white text-sm font-medium transition-colors h-9">
                {item.categoryTitle}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="p-3 md:w-[480px]">
                  <p className="section-label px-2 mb-3">Explorar por gênero</p>
                  <ul className="grid grid-cols-4 gap-1">
                    {item.categoryItems.map((categoryItem) => (
                      <GenreItem
                        key={categoryItem.title}
                        href={categoryItem.href}
                        title={categoryItem.title}
                        description={categoryItem.description}
                      />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function GenreItem({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <li className="list-none">
      <NavigationMenuLink asChild>
        <Link
          to={href as any}
          className="block px-3 py-2.5 rounded-md transition-colors group"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'oklch(52% 0.22 27 / 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <p className="text-sm font-semibold text-white leading-none mb-1">
            {title}
          </p>
          <p className="text-xs text-white/35 leading-snug line-clamp-1">
            {description}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}
