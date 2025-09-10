import { createRootRouteWithContext } from '@tanstack/react-router';
import type { JobvanaContextProps } from '../Context';
import Root from '../Root';

export const Route = createRootRouteWithContext<JobvanaContextProps>()({
  component: Root
});
