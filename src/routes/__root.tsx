import { createRootRoute, Outlet } from '@tanstack/react-router';
import { JobvanaContext } from '../Context';
import Header from '../Header';

export const Route = createRootRoute({
  component: () => (
    <JobvanaContext.Provider
      value={{
        companies: {
          page: 1,
          name: '',
          minSize: 1,
          maxSize: 1000
        },
        jobs: {
          page: 1,
          company: '',
          title: '',
          minSalary: 10000,
          maxSalary: 200000
        }
      }}
    >
      <Header />
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </JobvanaContext.Provider>
  )
});
