import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  Job as DbJob,
  JobSeeker as DbJobSeeker
} from '../../types';
import { descDateComparator } from '../../utils';

export type Job = Pick<DbJob, 'id' | 'title'>;
export type JobSeeker = Pick<DbJobSeeker, 'first_name' | 'last_name'>;

export type Application = Pick<
  DbApplication,
  'id' | 'created_at' | 'status' | 'updated_at'
> & {
  job: Job;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  resumePath: string;
};

export type Applications = {
  applications: Array<Application> | undefined;
  isPending: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
  updateStatus: (
    applicationId: number,
    status: 'accepted' | 'declined',
    userId: string
  ) => Promise<void>;
};

const useApplications = ({
  companyId
}: {
  companyId: number;
}): Applications => {
  const {
    data: applicationsData,
    isPending,
    error,
    refetch
  } = useQuery({
    queryKey: ['applications', { companyId }],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `id, created_at, status, updated_at,
          jobs!inner(id, title, companies(id)),
          job_seekers!inner(first_name, last_name),
          application_resumes!inner(resume_path)`
        )
        .filter('jobs.companies.id', 'eq', companyId);
      // console.log(data);
      return data;
    }
  });

  const applications: Array<Application> | undefined = useMemo(
    () =>
      applicationsData?.sort(descDateComparator).map((applicationData) => ({
        ..._.omit(applicationData, 'jobs'),
        job: _.pick(applicationData.jobs, 'id', 'title'),
        jobSeeker: applicationData.job_seekers,
        resumePath: applicationData.application_resumes.resume_path
      })),
    [applicationsData]
  );

  const updateStatus = async (
    applicationId: number,
    status: 'accepted' | 'declined',
    userId: string
  ) => {
    // TODO add a transaction for this
    const { error: appErr } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (appErr) {
      console.log(appErr);
      throw appErr;
    }

    const { error: appEventsErr } = await supabase
      .from('application_events')
      .insert({
        application_id: applicationId,
        user_id: userId,
        event: status
      });
    if (appEventsErr) {
      console.log(appEventsErr);
      throw appEventsErr;
    }

    if (status === 'accepted') {
      const { data: interviewsData, error: interviewsErr } = await supabase
        .from('interviews')
        .insert({
          application_id: applicationId
        })
        .select();
      if (interviewsErr) {
        console.log(interviewsErr);
        throw interviewsErr;
      }

      const { error: interviewRoundsErr } = await supabase
        .from('interview_rounds')
        .insert({
          interview_id: interviewsData[0].id,
          round: 1
        });
      if (interviewRoundsErr) {
        console.log(interviewRoundsErr);
        throw interviewRoundsErr;
      }
    }
  };

  return {
    applications,
    isPending,
    error: error ?? undefined,
    refetch,
    updateStatus
  };
};

export default useApplications;
