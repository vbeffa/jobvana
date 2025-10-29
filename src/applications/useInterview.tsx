import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type {
  Interview as DbInterview,
  InterviewRound as DbInterviewRound
} from '../types';

export type InterviewRound = Pick<
  DbInterviewRound,
  'round' | 'company_response' | 'job_seeker_response'
>;

export type Interview = Pick<DbInterview, 'id' | 'application_id'> & {
  rounds: Array<InterviewRound>;
};

export type InterviewH = {
  interview: Interview | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useInterview = ({
  applicationId
}: {
  applicationId: number;
}): InterviewH => {
  const queryKey = useMemo(
    () => ['interviews', { applicationId }],
    [applicationId]
  );

  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('interviews')
        .select(
          `id, application_id,
          interview_rounds!inner(round, company_response, job_seeker_response)`
        )
        .filter('application_id', 'eq', applicationId);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return data;
    }
  });

  const interview = useMemo(() => {
    const interview = data?.[0];
    if (!interview) {
      return;
    }
    return {
      id: interview.id,
      application_id: interview.application_id,
      rounds: interview.interview_rounds
    };
  }, [data]);

  return {
    interview,
    isPending,
    isPlaceholderData,
    error: error ?? undefined,
    refetch
  };
};

export default useInterview;
