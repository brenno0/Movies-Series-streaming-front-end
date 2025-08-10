import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router'

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
        <Link to='/home' className='absolute   left-20' >
          <p className=' text-4xl text-primary font-bold ' >NBFLIX</p>
        </Link>
        <NavigationMenuComponent items={TopNavItems} />
      </div>
      <Outlet />
     
    </>
  ),
})
