import { createFileRoute } from "@tanstack/react-router";
import Companies from "../companies/Companies";

export const Route = createFileRoute("/companies/")({
  component: Companies
});
