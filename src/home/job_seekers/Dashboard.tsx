import { useState } from 'react';
import {
  FaEyeSlash,
  FaFlag,
  FaFloppyDisk,
  FaInbox,
  FaMagnifyingGlass,
  FaWrench
} from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { type JobSeeker } from '../../Context';
import useApplicationNotifications from '../../notifications/job_seekers/useApplicationNotifications';
import SummaryCard from '../../SummaryCard';
import MyJobs from './MyJobs';
import Notifications from './Notifications';
import useMarkedJobs from './useMarkedJobs';

const Dashboard = ({ jobSeeker }: { jobSeeker: JobSeeker }) => {
  const [card, setCard] = useState<'inbox' | 'saved_searches' | 'my_jobs'>(
    'inbox'
  );

  const paging = {
    page: 1,
    pageSize: 1
  };

  const {
    count: unreadNotificationsCount,
    refetch: refetchUnreadNotificationsCount
  } = useApplicationNotifications(jobSeeker.id, 'unread', paging);
  const { count: savedJobsCount } = useMarkedJobs(
    jobSeeker.id,
    'saved',
    paging
  );
  const { count: hiddenJobsCount } = useMarkedJobs(
    jobSeeker.id,
    'hidden',
    paging
  );

  return (
    <>
      <h1>Dashboard</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'inbox'}
              onClick={() => setCard('inbox')}
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
                  <FaFlag /> {unreadNotificationsCount ?? 0} unread
                  notifications
                </div>
              }
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'saved_searches'}
              onClick={() => setCard('saved_searches')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaMagnifyingGlass />
                  </div>
                  Saved Searches
                </div>
              }
              text={
                <div className="flex flex-row gap-1 items-center">
                  Coming soon
                </div>
              }
              borderBottom={true}
            />
            <SummaryCard
              key={3}
              selected={card === 'my_jobs'}
              onClick={() => setCard('my_jobs')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaWrench />
                  </div>
                  My Jobs
                </div>
              }
              text={
                <>
                  <div className="flex flex-row gap-1 items-center">
                    <FaFloppyDisk />
                    {savedJobsCount ?? 0} saved
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <FaEyeSlash />
                    {hiddenJobsCount ?? 0} hidden
                  </div>
                </>
              }
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {card === 'inbox' && (
              <Notifications
                jobSeekerId={jobSeeker.id}
                onUpdate={refetchUnreadNotificationsCount}
              />
            )}
            {card === 'saved_searches' && <>Saved Searches</>}
            {card === 'my_jobs' && <MyJobs jobSeekerId={jobSeeker.id} />}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
