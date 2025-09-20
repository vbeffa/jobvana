import { createFileRoute } from '@tanstack/react-router';
import About from '../About';

export const Route = createFileRoute('/jobvana/about')({
  component: About
});
