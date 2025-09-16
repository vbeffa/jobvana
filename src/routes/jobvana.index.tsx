import { createFileRoute } from '@tanstack/react-router';
import Login from '../auth/Login';

export const Route = createFileRoute('/jobvana/')({
  component: Index
});

function Index() {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col">
        <div className="flex justify-center">
          <h3>Welcome to Jobvana!</h3>
        </div>
        <Login />
      </div>
    </div>
  );
}
