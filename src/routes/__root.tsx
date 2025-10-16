import { createRootRouteWithContext, Link } from '@tanstack/react-router';
import { FaFrown } from 'react-icons/fa';
import type { JobvanaContextProps } from '../Context';
import Root from '../Root';

export const Route = createRootRouteWithContext<JobvanaContextProps>()({
  component: Root,
  errorComponent: () => {
    return (
      <div className="flex justify-center mt-[25dvh]">
        <div className="border-[0.5px] border-blue-400 rounded-lg bg-blue-200 p-4">
          <div className="flex flex-row gap-1 items-center">
            <FaFrown className="text-blue-400" /> An unexpected error occurred.{' '}
            <FaFrown className="text-blue-400" />
          </div>
          <div className="flex justify-center">
            <Link to=".">Return home.</Link>
          </div>
          <div className="flex justify-center">
            <a href="mailto:support@jobvana.io">Contact us.</a>
          </div>
        </div>
      </div>
    );
  }
});
