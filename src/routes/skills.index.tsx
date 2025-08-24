import { createFileRoute } from "@tanstack/react-router";
import Skills from "../skills/Skills";

export const Route = createFileRoute("/skills/")({
  component: Skills
});
