import { createFileRoute } from "@tanstack/react-router";
import SkillType from "../skills/SkillType";

export const Route = createFileRoute(
  "/jobvana/skills/skill_types/$skill_type_id"
)({
  loader: ({ params: { skill_type_id } }) => ({
    skillTypeId: parseInt(skill_type_id)
  }),
  component: SkillType
});
