import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type Tool = Database['public']['Tables']['tools']['Row'];

export type Tools = {
  tools: Array<Tool> | undefined;
  isPending: boolean;
  findTool: (id: number) => Tool | undefined;
};

const useTools = (): Tools => {
  const { isPending, data: toolsData } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data } = await supabase.from('tools').select();
      return data;
    }
  });

  const tools = useMemo(() => {
    if (!toolsData) {
      return undefined;
    }
    return toolsData;
  }, [toolsData]);

  return {
    tools,
    isPending,
    findTool: (id: number) => tools?.find((tool) => tool.id === id)
  };
};

export default useTools;
