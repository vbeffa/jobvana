import { useQuery } from "@tanstack/react-query";
import supabase from "../utils/supabase";
import type { Database } from "../utils/types";

type Skill = Database["public"]["Tables"]["skills"]["Row"];

export type SkillsLite = {
  skills: Array<Skill> | undefined;
  isPending: boolean;
};

const useSkills = (): SkillsLite => {
  const { isPending, data: skillsData } = useQuery({
    queryKey: ["skillsLite"],
    queryFn: async () => {
      const { data } = await supabase.from("skills").select().order("name");
      return data;
    }
  });

  return {
    skills: skillsData ?? undefined,
    isPending
  };
};

export default useSkills;
