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

export type Skills = {
  skills: Array<Skill> | undefined;
  findSkill: (id: number) => Skill | undefined;

  skillTypes: Array<SkillType> | undefined;
  findSkillType: (id: number) => SkillType | undefined;
  findSkills: (skillTypeId: number) => Array<Skill> | undefined;
  findChildSkillTypes: (parentSkillId: number) => Array<SkillType> | undefined;

  skillVersion: (versionId: number) => SkillVersion | undefined;
  skillVersions: Array<SkillVersion> | undefined;
};

const useSkills = (): Skills => {
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
      return data;
    }
  });

  const { data: skillVersionsData } = useQuery({
    queryKey: ["skillVersions"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_versions").select();
      return data;
    }
  });

  const { data: skillRelationsData } = useQuery({
    queryKey: ["skillRelations"],
    queryFn: async () => {
      const { data } = await supabase.from("skill_relations").select();
      return data;
    }
  });

  const skillTypes = useMemo(
    () => skillTypesData ?? undefined,
    [skillTypesData]
  );
  const skillVersions = useMemo(
    () => skillVersionsData ?? undefined,
    [skillVersionsData]
  );
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
    skills,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id),

    skillTypes,
    findSkillType: (id: number) =>
      skillTypes?.find((skillType) => skillType.id === id),
    findSkills: (skillTypeId: number) =>
      skills?.filter((skill) => skill.skill_type_id === skillTypeId),
    findChildSkillTypes: (parentSkillId: number) =>
      skillTypes?.filter(
        (skillType) => skillType.parent_skill_type_id === parentSkillId
      ),

    skillVersion: (versionId: number) => {
      return skillVersions?.find(
        (skillVersion) => skillVersion.id === versionId
      );
    },
    skillVersions
  };
};

export default useSkills;
