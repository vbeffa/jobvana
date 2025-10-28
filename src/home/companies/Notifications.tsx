import { useMemo, useState } from 'react';
import Modal from '../../Modal';
import useApplicationNotifications from '../../notifications/companies/useApplicationNotifications';
import PageNav from '../../PageNav';
import type { Paging } from '../../types';
import NotificationsTable from './NotificationsTable';

const Notifications = ({
  companyId,
  onUpdate
}: {
  companyId: number;
  onUpdate: () => void;
}) => {
  const [notificationsTab, setNotificationsTab] = useState<
    'current' | 'archived'
  >('current');
  const [currentNotificationsPage, setCurrentNotificationsPage] = useState(1);
  const [archivedNotificationsPage, setArchivedNotificationsPage] = useState(1);

  const currentNotificationsPaging: Paging = useMemo(
    () => ({
      page: currentNotificationsPage,
      pageSize: 10
    }),
    [currentNotificationsPage]
  );

  const archivedNotificationsPaging: Paging = useMemo(
    () => ({
      page: archivedNotificationsPage,
      pageSize: 10
    }),
    [archivedNotificationsPage]
  );

  const {
    notifications: currentNotifications,
    count: currentNotificationsCount,
    isPending: isCurrentNotificationsPending,
    isPlaceholderData: isCurrentNotificationsPlaceholderData,
    refetch: refetchCurrentNotifications
  } = useApplicationNotifications(
    companyId,
    'current',
    currentNotificationsPaging
  );

  const {
    notifications: archivedNotifications,
    count: archivedNotificationsCount,
    isPending: isArchivedNotificationsPending,
    isPlaceholderData: isArchivedNotificationsPlaceholderData,
    refetch: refetchArchivedNotifications
  } = useApplicationNotifications(
    companyId,
    'archived',
    archivedNotificationsPaging
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-4 w-fit">
        <div
          className={`${notificationsTab === 'current' ? 'border-b-4' : ''} cursor-pointer`}
          onClick={() => {
            if (notificationsTab !== 'current') {
              setNotificationsTab('current');
            }
          }}
        >
          Current ({currentNotificationsCount ?? '..'})
        </div>
        <div
          className={`${notificationsTab === 'archived' ? 'border-b-4' : ''} cursor-pointer`}
          onClick={() => {
            if (notificationsTab !== 'archived') {
              setNotificationsTab('archived');
            }
          }}
        >
          Archived ({archivedNotificationsCount ?? '..'})
        </div>
      </div>
      <div className="h-full">
        {notificationsTab === 'current' && (
          <div className="pt-4 h-full">
            {isCurrentNotificationsPending && <Modal type="loading" />}
            {isCurrentNotificationsPlaceholderData && <Modal type="loading" />}
            {currentNotifications?.length ? (
              <div className="h-full flex flex-col justify-between">
                <NotificationsTable
                  notifications={currentNotifications}
                  onUpdate={() => {
                    onUpdate();
                    refetchCurrentNotifications();
                    refetchArchivedNotifications();
                  }}
                  type="current"
                />
                <PageNav
                  page={currentNotificationsPage}
                  total={currentNotificationsCount}
                  onSetPage={(page) => {
                    setCurrentNotificationsPage(page);
                  }}
                  isLoading={
                    isCurrentNotificationsPending ||
                    isCurrentNotificationsPlaceholderData
                  }
                  type={`${notificationsTab} notifications`}
                  borderBottom={false}
                />
              </div>
            ) : !isCurrentNotificationsPending ? (
              <>No notifications</>
            ) : null}
          </div>
        )}
        {notificationsTab === 'archived' && (
          <div className="pt-4 h-full">
            {isArchivedNotificationsPending && <Modal type="loading" />}
            {isArchivedNotificationsPlaceholderData && <Modal type="loading" />}
            {archivedNotifications?.length ? (
              <div className="h-full flex flex-col justify-between">
                <NotificationsTable
                  notifications={archivedNotifications}
                  onUpdate={() => {
                    onUpdate();
                    refetchCurrentNotifications();
                    refetchArchivedNotifications();
                  }}
                  type="archived"
                />
                <PageNav
                  page={archivedNotificationsPage}
                  total={archivedNotificationsCount}
                  onSetPage={(page) => {
                    setArchivedNotificationsPage(page);
                  }}
                  isLoading={
                    isArchivedNotificationsPending ||
                    isArchivedNotificationsPlaceholderData
                  }
                  type={`${notificationsTab} notifications`}
                  borderBottom={false}
                />
              </div>
            ) : !isArchivedNotificationsPending ? (
              <>No notifications</>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
