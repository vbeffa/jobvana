import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { InterviewRoundEvent as DbInterviewRoundEvent } from '../types';
import { dateComparator } from '../utils';

export type InterviewRoundEvent = Pick<
  DbInterviewRoundEvent,
  'created_at' | 'user_id' | 'event'
> & {
  round: number;
};

export type InterviewRoundEvents = {
  events: Array<InterviewRoundEvent> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useInterviewRoundEvents = ({
  interviewId
}: {
  interviewId?: number;
}): InterviewRoundEvents => {
  const queryKey = useMemo(
    () => ['interview_round_events', { interviewId }],
    [interviewId]
  );

  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!interviewId) {
        return null;
      }
      const { data } = await supabase
        .from('interview_round_events')
        .select(`created_at, interview_rounds!inner(round), user_id, event`)
        .filter('interview_rounds.interview_id', 'eq', interviewId);
      // console.log(data);
      return data;
    }
  });

  const events = useMemo(
    () =>
      data?.sort(dateComparator).map((interviewRoundData) => ({
        ..._.pick(interviewRoundData, 'created_at', 'user_id', 'event'),
        round: interviewRoundData.interview_rounds.round
      })),
    [data]
  );

  return {
    events,
    isPending,
    isPlaceholderData,
    error: error ?? undefined,
    refetch
  };
};

export default useInterviewRoundEvents;
