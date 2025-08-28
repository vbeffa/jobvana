import { createFileRoute } from '@tanstack/react-router';
import Company from '../companies/Company';

export const Route = createFileRoute('/jobvana/companies/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Company
});
