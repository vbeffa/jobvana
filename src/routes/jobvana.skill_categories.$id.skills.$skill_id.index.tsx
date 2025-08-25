import { createFileRoute } from "@tanstack/react-router";
import Skill from "../skills/Skill";

export const Route = createFileRoute("/jobvana/skill_categories/$id/skills/$skill_id/")({
  loader: ({ params: { id } }) => ({
    id: parseInt(id)
  }),
  component: Skill
});
