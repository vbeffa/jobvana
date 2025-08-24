import { createFileRoute } from "@tanstack/react-router";
import Jobs from "../jobs/Jobs";

export const Route = createFileRoute("/jobs/")({
  component: Jobs
});
