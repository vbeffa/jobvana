import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});

function About() {
  return <div className="p-2">Gamifying the job search process</div>;
}
