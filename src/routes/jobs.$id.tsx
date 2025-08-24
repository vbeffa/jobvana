import { createFileRoute } from "@tanstack/react-router";
import Job from "../jobs/Job";

export const Route = createFileRoute("/jobs/$id")({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Job
});
