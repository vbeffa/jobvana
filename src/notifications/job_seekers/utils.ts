import supabase from '../../db/supabase';
import type { NotificationStatus } from '../../types';

const addCompanyApplicationNotification = async ({
  applicationId,
  interviewRoundId,
  type
}: {
  applicationId: number;
  interviewRoundId?: number;
  type: 'submitted' | 'withdrawn' | 'round_accepted' | 'round_declined';
}) => {
  const { error: appEventsErr } = await supabase
    .from('company_application_notifications')
    .insert({
      application_id: applicationId,
      interview_round_id: interviewRoundId,
      type
    });
  if (appEventsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
  }
};

const updateJobSeekerApplicationNotificationStatus = async (
  notificationId: number,
  status: NotificationStatus
) => {
  const { error: appNotificationsErr } = await supabase
    .from('job_seeker_application_notifications')
    .update({
      status
    })
    .eq('id', notificationId);
  if (appNotificationsErr) {
    console.log(appNotificationsErr);
    throw appNotificationsErr;
  }
};

const markJobSeekerApplicationNotificationRead = async (
  notificationId: number
) => updateJobSeekerApplicationNotificationStatus(notificationId, 'read');

const markJobSeekerApplicationNotificationUnread = async (
  notificationId: number
) => updateJobSeekerApplicationNotificationStatus(notificationId, 'unread');

const archiveJobSeekerApplicationNotification = async (
  notificationId: number
) => updateJobSeekerApplicationNotificationStatus(notificationId, 'archived');

const unarchiveJobSeekerApplicationNotification = async (
  notificationId: number
) => updateJobSeekerApplicationNotificationStatus(notificationId, 'read');

export {
  addCompanyApplicationNotification,
  archiveJobSeekerApplicationNotification,
  markJobSeekerApplicationNotificationRead,
  markJobSeekerApplicationNotificationUnread,
  unarchiveJobSeekerApplicationNotification
};
