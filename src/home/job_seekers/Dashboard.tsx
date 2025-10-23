import { useState } from 'react';
import { FaEyeSlash, FaFloppyDisk, FaInbox, FaWrench } from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { type JobSeeker } from '../../Context';
import SummaryCard from '../../SummaryCard';
import MyJobs from './MyJobs';
import useMarkedJobs from './useMarkedJobs';

const Dashboard = ({ jobSeeker }: { jobSeeker: JobSeeker }) => {
  const [card, setCard] = useState<'inbox' | 'my_jobs'>('my_jobs');

  const { count: savedJobsCount } = useMarkedJobs(jobSeeker.id, 'saved', {
    page: 1,
    pageSize: 10
  });
  const { count: hiddenJobsCount } = useMarkedJobs(jobSeeker.id, 'hidden', {
    page: 1,
    pageSize: 10
  });

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
              text="Alerts & Notifications"
              borderBottom={true}
            />
            <SummaryCard
              key={2}
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
            {card === 'inbox' && <>Inbox</>}
            {card === 'my_jobs' && <MyJobs jobSeekerId={jobSeeker.id} />}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
