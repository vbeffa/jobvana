import { createFileRoute } from "@tanstack/react-router";
import Skill from "../skills/Skill";

export const Route = createFileRoute(
  "/jobvana/skill_categories/$id/skills/$skill_id/"
)({
  loader: ({ params: { id, skill_id } }) => ({
    id: parseInt(id),
    skillId: parseInt(skill_id)
  }),
  component: Skill
});
