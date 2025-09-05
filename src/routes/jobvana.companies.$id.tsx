import { createFileRoute } from '@tanstack/react-router';
import CompanyRoute from '../companies/CompanyRoute';

export const Route = createFileRoute('/jobvana/companies/$id')({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: CompanyRoute
});
