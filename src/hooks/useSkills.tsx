import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Skill as DbSkill, SkillCategory, SkillVersion } from './types';

export type Skill = DbSkill & {
  versions: Array<SkillVersion>;
  relatedSkills: Array<Skill>;
};

export type Skills = {
  skills: Array<Skill> | undefined;
  error?: Error;
  isPending: boolean;
  isPlaceholderData: boolean;
  skillsCount: number | undefined;
  findSkill: (id: number) => Skill | undefined;

  skillCategories: Array<SkillCategory> | undefined;
  rootCategories: Array<SkillCategory> | undefined;
  findSkillCategory: (id: number) => SkillCategory | undefined;
  findSkills: (skillCategoryId: number) => Array<Skill> | undefined;
  findChildSkillCategories: (
    parentSkillId: number
  ) => Array<SkillCategory> | undefined;

  skillVersions: Array<SkillVersion> | undefined;
  findSkillVersion: (versionId: number) => SkillVersion | undefined;
};

export type SkillsParams = {
  paging: {
    page: number;
    pageSize: number;
  };
};

type QueryKey = {
  page: number;
};

const useSkills = (
  params: SkillsParams = { paging: { page: 1, pageSize: 10 } }
): Skills => {
  const queryKey: QueryKey = useMemo(
    () => ({
      page: params.paging?.page
    }),
    [params.paging?.page]
  );
  console.log(params.paging);

  const {
    isPending,
    isPlaceholderData,
    data: skillsData,
    error
  } = useQuery({
    queryKey: ['skills', queryKey],
    queryFn: async () => {
      const { data, error, count } = await supabase
        .from('skills')
        .select('*', {
          count: 'exact'
        })
        .range(
          (params.paging.page - 1) * params.paging.pageSize,
          params.paging.page * params.paging.pageSize - 1
        )
        .order('name');
      return { data, error, count };
    }
  });

  const { data: skillCategoriesData } = useQuery({
    queryKey: ['skillCategories'],
    queryFn: async () => {
      const { data } = await supabase.from('skill_categories').select();
      return data;
    }
  });

  const { data: skillVersionsData } = useQuery({
    queryKey: ['skillVersions'],
    queryFn: async () => {
      const { data } = await supabase.from('skill_versions').select();
      return data;
    }
  });

  const { data: skillRelationsData } = useQuery({
    queryKey: ['skillRelations'],
    queryFn: async () => {
      const { data } = await supabase.from('skill_relations').select();
      return data;
    }
  });

  const skillCategories: Array<SkillCategory> | undefined = useMemo(() => {
    if (!skillCategoriesData) {
      return undefined;
    }
    const skillCategories: Array<SkillCategory> = skillCategoriesData.map(
      (skillCategory) => ({
        ...skillCategory,
        childCategories: [] // set to empty array to satisfy type checker
      })
    );
    // now that skillCategories is hydrated, can correctly set childCategories
    skillCategories.forEach((skillCategory) => {
      skillCategory.childCategories = skillCategories.filter(
        (category) => category.parent_skill_category_id === skillCategory.id
      );
    });
    return skillCategories;
  }, [skillCategoriesData]);
  const skillVersions = useMemo(
    () => skillVersionsData ?? undefined,
    [skillVersionsData]
  );
  const skillRelations = useMemo(
    () => skillRelationsData,
    [skillRelationsData]
  );

  const skills = useMemo(() => {
    if (
      !skillsData?.data ||
      !skillCategories ||
      !skillVersions ||
      !skillRelations
    ) {
      return undefined;
    }
    const skills: Array<Skill> = skillsData.data.map((skill) => ({
      ...skill,
      versions: skillVersions.filter(
        (skillVersion) => skillVersion.skill_id === skill.id
      ),
      relatedSkills: [] // set to empty array to satisfy type checker
    }));
    // now that skills is hydrated, can correctly set relatedSkills
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
      if (skill1.skill_category_id === skill2.skill_category_id) {
        return skill1.name.localeCompare(skill2.name);
      }
      const skillCategory1 = skillCategories.find(
        (skillCategory) => skillCategory.id === skill1.skill_category_id
      );
      const skillCategory2 = skillCategories.find(
        (skillCategory) => skillCategory.id === skill2.skill_category_id
      );
      return skillCategory1!.name.localeCompare(skillCategory2!.name);
    });
    return skills;
  }, [skillRelations, skillCategories, skillVersions, skillsData]);

  const skillsCount = useMemo(
    () => skillsData?.count ?? undefined,
    [skillsData?.count]
  );

  return {
    skills,
    error: error ?? undefined,
    isPending,
    isPlaceholderData,
    skillsCount,
    findSkill: (id: number) => skills?.find((skill) => skill.id === id),

    skillCategories,
    rootCategories: skillCategories?.filter(
      (category) => category.parent_skill_category_id === null
    ),
    findSkillCategory: (id: number) =>
      skillCategories?.find((skillCategory) => skillCategory.id === id),
    findSkills: (skillCategoryId: number) =>
      skills?.filter((skill) => skill.skill_category_id === skillCategoryId),
    findChildSkillCategories: (parentSkillId: number) =>
      skillCategories?.filter(
        (skillCategory) =>
          skillCategory.parent_skill_category_id === parentSkillId
      ),

    skillVersions,
    findSkillVersion: (versionId: number) => {
      return skillVersions?.find(
        (skillVersion) => skillVersion.id === versionId
      );
    }
  };
};

export default useSkills;
