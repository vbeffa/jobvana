import { createFileRoute } from "@tanstack/react-router";
import Job from "../jobs/Job";

export const Route = createFileRoute("/jobvana/jobs/$id")({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Job
});
