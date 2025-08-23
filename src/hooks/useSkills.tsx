import { useEffect, useState } from "react";
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
  all: Array<Skill>;
  types: Array<SkillType>;
  skill: (id: number) => Skill | undefined;
  version: (versionId: number) => SkillVersion | undefined;
  versions: (skillId: number) => Array<SkillVersion>;
};

const useSkills = (): SkillsHook => {
  const [skills, setSkills] = useState<Array<Skill>>([]);
  const [skillTypes, setSkillTypes] = useState<Array<SkillType>>([]);
  const [skillVersions, setSkillVersions] = useState<Array<SkillVersion>>([]);
  const [skillRelations, setSkillRelations] = useState<Array<SkillRelation>>(
    []
  );

  useEffect(() => {
    if (
      skills.length > 0 ||
      skillVersions.length === 0 ||
      skillTypes.length === 0 ||
      skillRelations.length === 0
    ) {
      return;
    }
    (async () => {
      const { data } = await supabase.from("skills").select();
      if (data === null) {
        return;
      }
      const skills: Array<Skill> = data.map((skill) => ({
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
            skills.filter(
              (skill) => skill.id === skillRelation.related_skill_id
            )
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
      setSkills(skills);
    })();
  }, [
    skillRelations,
    skillRelations.length,
    skillTypes,
    skillVersions,
    skillVersions.length,
    skills.length
  ]);

  useEffect(() => {
    if (skillTypes.length > 0) {
      return;
    }
    (async () => {
      const { data: skillTypes } = await supabase.from("skill_types").select();
      if (skillTypes === null) {
        return;
      }
      setSkillTypes(skillTypes);
    })();
  }, [skillTypes.length]);

  useEffect(() => {
    if (skillVersions.length > 0) {
      return;
    }
    (async () => {
      const { data: skillVersions } = await supabase
        .from("skill_versions")
        .select();
      if (skillVersions === null) {
        return;
      }
      setSkillVersions(skillVersions);
    })();
  }, [skillVersions.length]);

  useEffect(() => {
    if (skillRelations.length > 0) {
      return;
    }
    (async () => {
      const { data: skillRelations } = await supabase
        .from("skill_relations")
        .select();
      if (skillRelations === null) {
        return;
      }
      setSkillRelations(skillRelations);
    })();
  }, [skillRelations.length]);

  return {
    all: skills,
    types: skillTypes,
    skill: (id: number) => {
      return skills.find((skill) => skill.id === id);
    },
    version: (versionId: number) => {
      return skillVersions.find(
        (skillVersion) => skillVersion.id === versionId
      );
    },
    versions: (skillId: number) => {
      return skillVersions.filter(
        (skillVersion) => skillVersion.skill_id === skillId
      );
    }
  };
};

export default useSkills;
