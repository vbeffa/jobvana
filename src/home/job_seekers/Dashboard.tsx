import { useContext } from 'react';
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
import { JobSeekerContext, type JobSeeker } from '../../Context';
import useSavedSearches from '../../jobs/job_seekers/useSavedSearches';
import useApplicationNotifications from '../../notifications/job_seekers/useApplicationNotifications';
import SummaryCard from '../../SummaryCard';
import MyJobs from './MyJobs';
import Notifications from './Notifications';
import SavedSearchesTable from './SavedSearchesTable';
import useMarkedJobs from './useMarkedJobs';

const Dashboard = ({ jobSeeker }: { jobSeeker: JobSeeker }) => {
  const { homeNav, setHomeNav } = useContext(JobSeekerContext);

  const paging = {
    page: 1,
    pageSize: 1
  };

  const {
    count: unreadNotificationsCount,
    refetch: refetchUnreadNotificationsCount
  } = useApplicationNotifications(jobSeeker.id, 'unread', paging);
  const { count: savedSearchesCount } = useSavedSearches(jobSeeker.id);
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
              selected={homeNav === 'notifications'}
              onClick={() => setHomeNav('notifications')}
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
            <SummaryCard
              key={2}
              selected={homeNav === 'saved_searches'}
              onClick={() => setHomeNav('saved_searches')}
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
                  {savedSearchesCount} saved search
                  {savedSearchesCount !== 1 ? 'es' : ''}
                </div>
              }
              borderBottom={true}
            />
            <SummaryCard
              key={3}
              selected={homeNav === 'my_jobs'}
              onClick={() => setHomeNav('my_jobs')}
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
        <ResourceDetailsContainer padding="">
          <div className="h-full overflow-auto">
            {homeNav === 'notifications' && (
              <Notifications
                jobSeekerId={jobSeeker.id}
                onUpdate={refetchUnreadNotificationsCount}
              />
            )}
            {homeNav === 'saved_searches' && (
              <SavedSearchesTable jobSeekerId={jobSeeker.id} />
            )}
            {homeNav === 'my_jobs' && <MyJobs jobSeekerId={jobSeeker.id} />}
          </div>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
