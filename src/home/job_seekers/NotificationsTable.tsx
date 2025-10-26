import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa6';
import { MdArchive, MdUnarchive } from 'react-icons/md';
import ApplicationLink from '../../applications/ApplicationLink';
import Status from '../../applications/Status';
import CompanyLink from '../../companies/CompanyLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import type { ApplicationNotification } from '../../notifications/job_seekers/useApplicationNotifications';
import {
  archiveJobSeekerApplicationNotification,
  markJobSeekerApplicationNotificationRead,
  markJobSeekerApplicationNotificationUnread,
  unarchiveJobSeekerApplicationNotification
} from '../../notifications/utils';

const NotificationsTable = ({
  notifications,
  onUpdate
}: {
  notifications: Array<ApplicationNotification>;
  onUpdate: () => void;
}) => {
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState<Map<number, boolean>>(
    new Map(notifications.map((n) => [n.id, false]))
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error>();

  useEffect(() => {
    if (allSelected) {
      setSelected(new Map(notifications.map((n) => [n.id, true])));
    }
  }, [allSelected, notifications]);

  const onMarkRead = useCallback(
    async (notificationId: number, showUpdating = true) => {
      setIsUpdating(showUpdating);
      setUpdateError(undefined);
      try {
        await markJobSeekerApplicationNotificationRead(notificationId);
        onUpdate();
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdate]
  );

  const onMarkUnread = useCallback(
    async (notificationId: number) => {
      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await markJobSeekerApplicationNotificationUnread(notificationId);
        onUpdate();
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdate]
  );

  const onArchive = useCallback(
    async (notificationId: number) => {
      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await archiveJobSeekerApplicationNotification(notificationId);
        onUpdate();
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdate]
  );

  const onUnarchive = useCallback(
    async (notificationId: number) => {
      setIsUpdating(true);
      setUpdateError(undefined);
      try {
        await unarchiveJobSeekerApplicationNotification(notificationId);
        onUpdate();
      } catch (err) {
        console.log(err);
        setUpdateError(err as Error);
      } finally {
        setIsUpdating(false);
      }
    },
    [onUpdate]
  );

  return (
    <div>
      {isUpdating && <Modal type="updating" />}
      {updateError && <JobvanaError error={updateError} />}
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-[5%]">
              <div className="px-2 flex justify-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => {
                    setSelected(
                      new Map(notifications.map((n) => [n.id, !allSelected]))
                    );
                    setAllSelected(!allSelected);
                  }}
                />
              </div>
            </th>
            <th className="w-[10%]">Date</th>
            <th className="w-[20%]">Company</th>
            <th className="min-w-[25%]">Application</th>
            <th className="w-[12%]">Status</th>
            <th className="w-[10%]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification, idx) => (
            <tr
              key={idx}
              className={`${notification.status === 'unread' ? 'font-bold' : ''} ${idx % 2 === 1 ? 'bg-gray-200' : ''}`}
            >
              <td>
                <div className="px-2 flex justify-center">
                  <input
                    id={`checkbox_${notification.id}`}
                    type="checkbox"
                    checked={selected.get(notification.id) ?? false}
                    onChange={() => {
                      setSelected((selected) => {
                        const updated = _.cloneDeep(selected);
                        updated.set(
                          notification.id,
                          !updated.get(notification.id)
                        );
                        if (
                          Array.from(updated.values()).every(
                            (selected) => selected
                          )
                        ) {
                          setAllSelected(true);
                        } else {
                          setAllSelected(false);
                        }
                        return updated;
                      });
                    }}
                  />
                </div>
              </td>
              <td>
                <div className="flex justify-center">
                  {new Date(notification.created_at).toLocaleDateString()}
                </div>
              </td>
              <td>
                <div className="px-2">
                  <div
                    onClick={() => {
                      if (notification.status === 'unread') {
                        onMarkRead(notification.id, false);
                      }
                    }}
                  >
                    <CompanyLink {...notification.company} />
                  </div>
                </div>
              </td>
              <td>
                <div className="px-2">
                  <div
                    onClick={() => {
                      if (notification.status === 'unread') {
                        onMarkRead(notification.id, false);
                      }
                    }}
                  >
                    <ApplicationLink
                      applicationId={notification.application_id}
                      jobTitle={notification.job.title}
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className="px-2 flex justify-center">
                  <Status status={notification.type} />
                </div>
              </td>
              <td>
                <div className="flex flex-row items-center gap-1 justify-center text-blue-500">
                  {notification.status !== 'archived' && (
                    <>
                      {notification.status === 'unread' && (
                        <FaEnvelopeOpen
                          className="hover:text-blue-400 cursor-pointer"
                          onClick={() => onMarkRead(notification.id)}
                        />
                      )}
                      {notification.status === 'read' && (
                        <FaEnvelope
                          className="hover:text-blue-400 cursor-pointer"
                          onClick={() => onMarkUnread(notification.id)}
                        />
                      )}
                      <MdArchive
                        className="hover:text-blue-400 text-xl cursor-pointer"
                        onClick={() => onArchive(notification.id)}
                      />
                    </>
                  )}
                  {notification.status === 'archived' && (
                    <MdUnarchive
                      className="hover:text-blue-400 text-xl cursor-pointer"
                      onClick={() => onUnarchive(notification.id)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationsTable;
