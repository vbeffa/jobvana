import { createFileRoute } from "@tanstack/react-router";
import Company from "../companies/Company";

export const Route = createFileRoute("/companies/$id")({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Company
});
