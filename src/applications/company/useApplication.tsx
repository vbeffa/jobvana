import {
  keepPreviousData,
  useQuery,
  type QueryObserverResult
} from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import type { InterviewProcess } from '../../companies/company/utils';
import supabase from '../../db/supabase';
import type {
  ApplicationStatus,
  Application as DbApplication,
  ApplicationEvent as DbApplicationEvent,
  Interview as DbInterview,
  InterviewRound as DbInterviewRound,
  InterviewRoundEvent as DbInterviewRoundEvent,
  Job as DbJob,
  InterviewStatus
} from '../../types';

export type Job = Pick<DbJob, 'id' | 'title'>;
export type JobSeeker = {
  id: number;
  name: string;
};
export type ApplicationEvent = Pick<DbApplicationEvent, 'created_at' | 'event'>;
export type Interview = Pick<DbInterview, 'id' | 'application_id'> & {
  rounds: Array<InterviewRound>;
  events: Array<InterviewRoundEvent>; // bring events up to interview level to avoid additional mapping in ApplicationDetails
};
export type InterviewRound = Pick<
  DbInterviewRound,
  'round' | 'job_seeker_response' | 'company_response'
> & {};
export type InterviewRoundEvent = Pick<
  DbInterviewRoundEvent,
  'created_at' | 'user_id' | 'event'
> & {
  round: number;
};

export type Application = Pick<
  DbApplication,
  'id' | 'created_at' | 'status' | 'updated_at'
> & {
  job: Job;
  jobSeeker: JobSeeker;
  status: ApplicationStatus;
  interviewStatus: InterviewStatus;
  events: Array<ApplicationEvent>;
  interview?: Interview;
  resumePath: string;
  interviewProcess: InterviewProcess;
};

export type ApplicationH = {
  application: Application | undefined;
  isPending: boolean;
  isPlaceholderData: boolean;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useApplication = ({ id }: { id: number }): ApplicationH => {
  const { data, isPending, isPlaceholderData, error, refetch } = useQuery({
    queryKey: ['applications', { id }],
    queryFn: async () => {
      const { data } = await supabase
        .from('applications')
        .select(
          `id, created_at, status, updated_at,
            jobs!inner(
              id,
              title,
              interview_process
            ),
            job_seekers!inner(id, first_name, last_name),
            application_events!inner(created_at, event),
            interviews(id, application_id,
              interview_rounds!inner(round, job_seeker_response, company_response,
                interview_round_events(created_at, user_id, event)
              )
            ),
            application_resumes!inner(resume_path)`
        )
        .filter('id', 'eq', id);
      // console.log(data);
      return data?.[0];
    },
    placeholderData: keepPreviousData
  });

  const application: Application | undefined = useMemo(() => {
    if (!data) {
      return undefined;
    }

    let interview: Interview | undefined;
    if (data.interviews) {
      interview = {
        ..._.pick(data.interviews, 'id', 'application_id'),
        rounds: data.interviews.interview_rounds.map((round) => ({
          ..._.pick(round, 'round', 'job_seeker_response', 'company_response')
        })),
        events: data.interviews.interview_rounds.flatMap((round) =>
          round.interview_round_events.map((event) => ({
            ...event,
            round: round.round
          }))
        )
      };
    }

    let interviewStatus: InterviewStatus;
    if (!interview?.events.length) {
      interviewStatus = 'pending';
    } else if (interview.events.some((event) => event.event === 'declined')) {
      interviewStatus = 'declined';
    } else if (interview.events.length < interview.rounds.length * 2) {
      interviewStatus = 'in_process';
    } else {
      interviewStatus = 'completed';
    }

    const application: Application = {
      ..._.pick(data, 'id', 'created_at', 'status', 'updated_at'),
      job: _.pick(data.jobs, 'id', 'title'),
      jobSeeker: {
        id: data.job_seekers.id,
        name: `${data.job_seekers.first_name} ${data.job_seekers.last_name}`
      },
      events: data.application_events,
      resumePath: data.application_resumes.resume_path,
      interviewProcess: data.jobs.interview_process as InterviewProcess,
      interviewStatus
    };

    if (interview) {
      application.interview = interview;
    }

    // console.log(application);
    return application;
  }, [data]);

  return {
    application,
    isPending,
    isPlaceholderData,
    error: error ?? undefined,
    refetch
  };
};

export default useApplication;
