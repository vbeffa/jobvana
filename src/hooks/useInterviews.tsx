import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../utils/supabase';
import type { Database } from '../utils/types';

export type InterviewRound =
  Database['public']['Tables']['interview_rounds']['Row'];

export type Interview = Database['public']['Tables']['interviews']['Row'] & {
  // rounds: Array<InterviewRound>;
};

export type Interviews = {
  interviews: Array<Interview> | undefined;
  isPending: boolean;
};

const useInterviews = (): Interviews => {
  const { isPending, data: interviewsData } = useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const { data } = await supabase
        .from('interviews')
        .select('*, interview_rounds!inner(*)');
      return data;
    }
  });

  const interviews = useMemo(
    () =>
      interviewsData
        ?.sort(
          (interview1, interview2) =>
            interview1.application_id - interview2.application_id
        )
        .map((interviewData) => ({
          ...interviewData
        })),
    [interviewsData]
  );

  return {
    interviews,
    isPending
  };
};

export default useInterviews;
