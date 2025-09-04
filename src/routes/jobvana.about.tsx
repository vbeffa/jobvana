import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});

function About() {
  return <div className="pl-4">Gamifying the job search process</div>;
}
