import { createFileRoute } from '@tanstack/react-router';
import { useContext } from 'react';
import Login from '../auth/Login';
import { JobvanaContext } from '../Context';

export const Route = createFileRoute('/jobvana/')({
  component: Index
});

function Index() {
  const { loggedIn } = useContext(JobvanaContext);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <h3>Welcome to Jobvana!</h3>
        </div>
        {!loggedIn && <Login />}
      </div>
    </div>
  );
}
