import supabase from '../../db/supabase';
import type { NotificationStatus } from '../../types';

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

const updateCompanyApplicationNotificationStatus = async (
  notificationId: number,
  status: NotificationStatus
) => {
  const { error: appNotificationsErr } = await supabase
    .from('company_application_notifications')
    .update({
      status
    })
    .eq('id', notificationId);
  if (appNotificationsErr) {
    console.log(appNotificationsErr);
    throw appNotificationsErr;
  }
};

const markCompanyApplicationNotificationRead = async (notificationId: number) =>
  updateCompanyApplicationNotificationStatus(notificationId, 'read');

const markCompanyApplicationNotificationUnread = async (
  notificationId: number
) => updateCompanyApplicationNotificationStatus(notificationId, 'unread');

const archiveCompanyApplicationNotification = async (notificationId: number) =>
  updateCompanyApplicationNotificationStatus(notificationId, 'archived');

const unarchiveCompanyApplicationNotification = async (
  notificationId: number
) => updateCompanyApplicationNotificationStatus(notificationId, 'read');

export {
  addJobSeekerApplicationNotification,
  archiveCompanyApplicationNotification,
  markCompanyApplicationNotificationRead,
  markCompanyApplicationNotificationUnread,
  unarchiveCompanyApplicationNotification
};
