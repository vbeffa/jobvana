import { createFileRoute } from '@tanstack/react-router';
import About from '../about/About';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});
