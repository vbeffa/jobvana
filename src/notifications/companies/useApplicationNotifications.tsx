import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type {
  CompanyApplicationNotification as DbCompanyApplicationNotification,
  Job as DbJob,
  JobSeeker as DbJobSeeker,
  Paging
} from '../../types';

export type ApplicationNotification = Pick<
  DbCompanyApplicationNotification,
  'id' | 'created_at' | 'application_id' | 'type' | 'status'
> & {
  jobSeeker: Pick<DbJobSeeker, 'id' | 'first_name' | 'last_name'>;
  job: Pick<DbJob, 'id' | 'title'>;
};

export type ApplicationNotifications = {
  notifications: Array<ApplicationNotification> | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  count: number | undefined;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useApplicationNotifications = (
  companyId: number,
  status: 'unread' | 'current' | 'archived',
  paging: Paging
): ApplicationNotifications => {
  const {
    data: notificationsData,
    isPending,
    isPlaceholderData,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', companyId, status, paging],
    queryFn: async () => {
      const { page, pageSize } = paging;
      let q = supabase.from('company_application_notifications').select(
        `id, created_at, application_id, type, status,
          applications!inner(
            jobs!inner(id, title,
              companies!inner(id)
            ),
            job_seekers!inner(id, first_name, last_name)
          )`,
        {
          count: 'exact'
        }
      );
      // .filter('applications.jobs.company_id', 'eq', companyId);

      if (status === 'current') {
        q = q.not('status', 'eq', 'archived');
      } else if (status === 'archived') {
        q = q.filter('status', 'eq', 'archived');
      } else {
        q = q.filter('status', 'eq', 'unread');
      }

      q = q
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      const { data, count, error } = await q;
      if (error) {
        console.log(error);
      }
      // console.log(data);
      return { data, count, error };
    },
    placeholderData: keepPreviousData
  });

  const notifications: Array<ApplicationNotification> | undefined =
    useMemo(() => {
      return notificationsData?.data?.map((notificationData) => ({
        ..._.pick(
          notificationData,
          'id',
          'created_at',
          'application_id',
          'type',
          'status'
        ),
        company: notificationData.applications.jobs.companies,
        jobSeeker: notificationData.applications.job_seekers,
        job: _.pick(notificationData.applications.jobs, 'id', 'title')
      }));
    }, [notificationsData?.data]);

  return {
    notifications,
    isPending,
    isPlaceholderData,
    count: notificationsData?.count ?? undefined,
    error: error ?? undefined,
    refetch
  };
};

export default useApplicationNotifications;
