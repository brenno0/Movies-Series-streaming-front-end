import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { NavigationMenuComponent } from '@/components/TopNav/index.tsx'
import { TopNavItems } from '@/constants/TopNav/items.ts'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { QueryParamInput } from '@/components/QueryParamInput'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <NuqsAdapter>
      <div className="z-[99] w-full bg-transparent">
        <div className="flex px-15 justify-between items-center w-full my-5">
          <Link to="/home">
            <p className=" text-4xl font-bold ">NBFLIX</p>
          </Link>
          <NavigationMenuComponent items={TopNavItems} />
          <div>
            <QueryParamInput className="max-w-70 rounded-2xl" />
          </div>
        </div>
      </div>
      <Outlet />
    </NuqsAdapter>
  ),
})
