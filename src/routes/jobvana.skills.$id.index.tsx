import { createFileRoute } from "@tanstack/react-router";
import Skill from "../skills/Skill";

export const Route = createFileRoute("/jobvana/skills/$id/")({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Skill
});
