import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { NavigationMenuComponent } from '@/components/TopNav/index.tsx'
import { TopNavItems } from '@/constants/TopNav/items.ts'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className='flex justify-center items-center w-full my-5' >
          <p className='absolute text-4xl text-primary font-bold  left-20 ' >NBFLIX</p>
        <NavigationMenuComponent items={TopNavItems} />
      </div>
      <Outlet />
     
    </>
  ),
})
