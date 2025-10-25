import supabase from '../db/supabase';
import type { NotificationStatus } from '../types';

const addCompanyApplicationNotification = async (
  applicationId: number,
  type: 'submitted' | 'withdrawn'
) => {
  const { error: appEventsErr } = await supabase
    .from('company_application_notifications')
    .insert({
      application_id: applicationId,
      type
    });
  if (appEventsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
  }
};

const addJobSeekerApplicationNotification = async (
  applicationId: number,
  type: 'accepted' | 'declined'
) => {
  const { error: appEventsErr } = await supabase
    .from('job_seeker_application_notifications')
    .insert({
      application_id: applicationId,
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
  const { error: appEventsErr } = await supabase
    .from('job_seeker_application_notifications')
    .update({
      status
    })
    .eq('id', notificationId);
  if (appEventsErr) {
    console.log(appEventsErr);
    throw appEventsErr;
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
  addJobSeekerApplicationNotification,
  archiveJobSeekerApplicationNotification,
  markJobSeekerApplicationNotificationRead,
  markJobSeekerApplicationNotificationUnread,
  unarchiveJobSeekerApplicationNotification
};
