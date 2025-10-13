import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import supabase from '../db/supabase';
import type { ApplicationEvent as DbApplicationEvent } from '../types';
import { dateComparator } from '../utils';

export type ApplicationEvent = Pick<DbApplicationEvent, 'created_at' | 'event'>;

export type ApplicationEvents = {
  events: Array<ApplicationEvent> | undefined;
  isPending: boolean;
  error?: Error;
};

const useApplicationEvents = ({
  applicationId
}: {
  applicationId: number;
}): ApplicationEvents => {
  const queryKey = useMemo(
    () => ['application_events', { applicationId }],
    [applicationId]
  );

  const { data, isPending, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await supabase
        .from('application_events')
        .select(`created_at, event`)
        .filter('application_id', 'eq', applicationId);
      // console.log(data);
      return data;
    }
  });

  const events = useMemo(() => data?.sort(dateComparator), [data]);

  return {
    events,
    isPending,
    error: error ?? undefined
  };
};

export default useApplicationEvents;
