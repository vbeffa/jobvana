import { createFileRoute } from "@tanstack/react-router";
import SkillCategory from "../skills/SkillCategory";

export const Route = createFileRoute(
  "/jobvana/skill_categories/$skill_category_id"
)({
  loader: ({ params: { skill_category_id } }) => ({
    skillCategoryId: parseInt(skill_category_id)
  }),
  component: SkillCategory
});
