import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/jobvana/')({
  component: Index
});

function Index() {
  return (
    <div className="flex justify-center">
      <h3>Welcome to Jobvana!</h3>
    </div>
  );
}
