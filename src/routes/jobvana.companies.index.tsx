import { createFileRoute } from "@tanstack/react-router";
import Companies from "../companies/Companies";

export const Route = createFileRoute("/jobvana/companies/")({
  component: Companies
});
