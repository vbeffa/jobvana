import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";

export type Skill = Database["public"]["Tables"]["skills"]["Row"] & {
  versions: Array<SkillVersion>;
  relatedSkills: Array<Skill>;
};

export type SkillRelation =
  Database["public"]["Tables"]["skill_relations"]["Row"];

export type SkillVersion =
  Database["public"]["Tables"]["skill_versions"]["Row"];

export type SkillType = Database["public"]["Tables"]["skill_types"]["Row"];

export type SkillsHook = {
  all?: Array<Skill>;
  types?: Array<SkillType>;
  skill: (id: number) => Skill | undefined;
  version: (versionId: number) => SkillVersion | undefined;
  versions: (skillId: number) => Array<SkillVersion> | undefined;
};

const useSkills = (): SkillsHook => {
  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select();
      return data;
    }
  });

  const { data: skillTypesData } = useQuery({
    queryKey: ["skillTypes"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_types").select();
      return data ?? undefined;
    }
  });

  const { data: skillVersionsData } = useQuery({
    queryKey: ["skillVersions"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_versions").select();
      return data ?? undefined;
    }
  });

  const { data: skillRelationsData } = useQuery({
    queryKey: ["skillVersions"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_relations").select();
      return data ?? undefined;
    }
  });

  const skillTypes = useMemo(() => skillTypesData, [skillTypesData]);
  const skillVersions = useMemo(() => skillVersionsData, [skillVersionsData]);
  const skillRelations = useMemo(
    () => skillRelationsData,
    [skillRelationsData]
  );

  const skills = useMemo(() => {
    if (!skillsData || !skillTypes || !skillVersions || !skillRelations) {
      return undefined;
    }
    const skills: Array<Skill> = skillsData.map((skill) => ({
      ...skill,
      versions: skillVersions.filter(
        (skillVersion) => skillVersion.skill_id === skill.id
      ),
      relatedSkills: [] // set to empty array
    }));
    // now that skills is hydrated, can set relatedSkills to satisfy type checker
    skills.forEach((skill) => {
      skill.relatedSkills = skillRelations
        .filter((skillRelation) => skillRelation.skill_id === skill.id)
        .flatMap((skillRelation) =>
          skills.filter((skill) => skill.id === skillRelation.related_skill_id)
        );
    });
    for (const skill of skills) {
      const versionsForSkill = skillVersions.filter(
        (skillVersion) => skillVersion.skill_id === skill.id
      );
      skill.versions = versionsForSkill;
    }
    skills.sort((skill1, skill2) => {
      if (skill1.skill_type_id === skill2.skill_type_id) {
        return skill1.name.localeCompare(skill2.name);
      }
      const skillType1 = skillTypes.find(
        (skillType) => skillType.id === skill1.skill_type_id
      );
      const skillType2 = skillTypes.find(
        (skillType) => skillType.id === skill2.skill_type_id
      );
      return skillType1!.name.localeCompare(skillType2!.name);
    });
    return skills;
  }, [skillRelations, skillTypes, skillVersions, skillsData]);

  return {
    all: skills,
    types: skillTypes,
    skill: (id: number) => {
      return skills?.find((skill) => skill.id === id);
    },
    version: (versionId: number) => {
      return skillVersions?.find(
        (skillVersion) => skillVersion.id === versionId
      );
    },
    versions: (skillId: number) => {
      return skillVersions?.filter(
        (skillVersion) => skillVersion.skill_id === skillId
      );
    }
  };
};

export default useSkills;
