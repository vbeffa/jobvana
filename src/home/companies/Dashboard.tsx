import { FaFlag, FaInbox } from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { type Company } from '../../Context';
import useApplicationNotifications from '../../notifications/companies/useApplicationNotifications';
import SummaryCard from '../../SummaryCard';
import Notifications from './Notifications';

const Dashboard = ({ company }: { company: Company }) => {
  const paging = {
    page: 1,
    pageSize: 1
  };

  const {
    count: unreadNotificationsCount,
    refetch: refetchUnreadNotificationsCount
  } = useApplicationNotifications(company.id, 'unread', paging);

  return (
    <>
      <h1>Dashboard</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={true}
              onClick={() => {}}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaInbox />
                  </div>
                  Inbox
                </div>
              }
              text={
                <div className="flex flex-row gap-1 items-center">
                  <FaFlag /> {unreadNotificationsCount ?? 0} unread notification
                  {unreadNotificationsCount !== 1 ? 's' : ''}
                </div>
              }
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          <>
            <Notifications
              companyId={company.id}
              onUpdate={refetchUnreadNotificationsCount}
            />
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
