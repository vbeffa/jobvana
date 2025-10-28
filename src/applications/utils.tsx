import { FaArchive, FaDraftingCompass } from 'react-icons/fa';
import {
  FaBuilding,
  FaCheck,
  FaCheckDouble,
  FaNewspaper,
  FaPaperPlane,
  FaRegCircleCheck,
  FaRegCircleXmark,
  FaSpinner,
  FaUser
} from 'react-icons/fa6';
import { MdOutlinePending } from 'react-icons/md';
import { PiHandWithdraw } from 'react-icons/pi';
import type { UserType } from '../Context';
import supabase from '../db/supabase';
import { addJobSeekerApplicationNotification } from '../notifications/companies/utils';
import { addCompanyApplicationNotification } from '../notifications/job_seekers/utils';
import type {
  ApplicationStatus,
  Company as DbCompany,
  InterviewRoundStatus,
  InterviewStatus,
  JobStatus
} from '../types';

export type Company = Pick<DbCompany, 'name'>;

const applicationEventUser = (
  event: ApplicationStatus,
  jobSeekerName: string,
  company: Company
) => {
  switch (event) {
    case 'submitted':
    case 'withdrawn':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaUser />
          {jobSeekerName}
        </div>
      );
    case 'accepted':
    case 'declined':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaBuilding />
          {company.name}
        </div>
      );
  }
};

const getIcon = (
  status:
    | JobStatus
    | ApplicationStatus
    | InterviewStatus
    | InterviewRoundStatus
    | 'created'
    | 'round_accepted'
    | 'round_declined'
) => {
  switch (status) {
    case 'draft':
      return <FaDraftingCompass />;
    case 'open':
      return <FaRegCircleCheck />;
    case 'closed':
      return <FaArchive />;
    case 'created':
      return <FaNewspaper />;
    case 'submitted':
      return <FaPaperPlane />;
    case 'accepted':
    case 'round_accepted':
      return <FaCheck />;
    case 'completed':
    case 'filled':
      return <FaCheckDouble />;
    case 'withdrawn':
      return <PiHandWithdraw className="text-lg" />;
    case 'declined':
    case 'round_declined':
      return <FaRegCircleXmark />;
    case 'pending':
      return <MdOutlinePending />;
    case 'in_process':
      return <FaSpinner />;
  }
};

const updateStatus = async (
  applicationId: number,
  status: 'withdrawn' | 'accepted' | 'declined',
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

    await addJobSeekerApplicationNotification({
      applicationId,
      type: 'accepted'
    });
  } else if (status === 'declined') {
    await addJobSeekerApplicationNotification({
      applicationId,
      type: 'declined'
    });
  } else {
    await addCompanyApplicationNotification({
      applicationId,
      type: 'withdrawn'
    });
  }
};

const withdrawApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'withdrawn', userId);
};

const acceptApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'accepted', userId);
};

const declineApplication = async (applicationId: number, userId: string) => {
  updateStatus(applicationId, 'declined', userId);
};

const updateRound = async ({
  applicationId,
  interviewId,
  round,
  numRounds,
  status,
  userType,
  userId
}: {
  applicationId: number;
  interviewId: number;
  round: number;
  numRounds: number;
  status: 'accepted' | 'declined';
  userType: UserType;
  userId: string;
}) => {
  let roundCompleted = false;
  let allRoundsCompleted = false;
  const { data, error } = await supabase
    .from('interview_rounds')
    .update(
      userType === 'company'
        ? { company_response: status }
        : { job_seeker_response: status }
    )
    .filter('interview_id', 'eq', interviewId)
    .filter('round', 'eq', round)
    .select();

  if (error) {
    console.log(error);
    throw error;
  }
  const interviewRound = data[0];

  const { error: eventsError } = await supabase
    .from('interview_round_events')
    .insert({
      interview_round_id: interviewRound.id,
      user_id: userId,
      event: status
    });
  if (eventsError) {
    console.log(eventsError);
    throw eventsError;
  }

  if (
    interviewRound.company_response === 'accepted' &&
    interviewRound.job_seeker_response === 'accepted'
  ) {
    roundCompleted = true;
    if (interviewRound.round < numRounds) {
      const { error: interviewRoundsErr } = await supabase
        .from('interview_rounds')
        .insert({
          interview_id: interviewId,
          round: interviewRound.round + 1
        });
      if (interviewRoundsErr) {
        console.log(interviewRoundsErr);
        throw interviewRoundsErr;
      }
    } else {
      allRoundsCompleted = true;
    }
  } else if (status === 'declined') {
    const appStatus = userType === 'company' ? 'declined' : 'withdrawn';
    const { error: applicationsErr } = await supabase
      .from('applications')
      .update({
        status: appStatus
      })
      .filter('id', 'eq', applicationId);
    if (applicationsErr) {
      console.log(applicationsErr);
      throw applicationsErr;
    }

    const { error: appEventsErr } = await supabase
      .from('application_events')
      .insert({
        application_id: applicationId,
        user_id: userId,
        event: appStatus
      });
    if (appEventsErr) {
      console.log(appEventsErr);
      throw appEventsErr;
    }
  }

  if (userType === 'company') {
    addJobSeekerApplicationNotification({
      applicationId,
      interviewRoundId: interviewRound.id,
      type: `round_${status}`
    });
  } else {
    addCompanyApplicationNotification({
      applicationId,
      interviewRoundId: interviewRound.id,
      type: `round_${status}`
    });
  }

  return [roundCompleted, allRoundsCompleted];
};

export {
  acceptApplication,
  applicationEventUser,
  declineApplication,
  getIcon,
  updateRound,
  updateStatus,
  withdrawApplication
};
