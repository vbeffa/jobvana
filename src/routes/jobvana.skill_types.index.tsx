import { createFileRoute } from "@tanstack/react-router";
import SkillTypes from "../skills/SkillTypes";

export const Route = createFileRoute("/jobvana/skill_types/")({
  component: SkillTypes
});
