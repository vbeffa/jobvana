import { useState } from 'react';
import { FaEyeSlash, FaFloppyDisk, FaInbox } from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { type JobSeeker } from '../../Context';
import Section from '../../Section';
import SummaryCard from '../../SummaryCard';
import MarkedJobsTable from './MarkedJobsTable';
import useMarkedJobs from './useMarkedJobs';

const Dashboard = ({ jobSeeker }: { jobSeeker: JobSeeker }) => {
  const [card, setCard] = useState<'inbox' | 'marked_jobs'>('marked_jobs');
  const {
    jobs: hiddenJobs,
    count: hiddenJobsCount,
    refetch: refetchHiddenJobs
  } = useMarkedJobs(jobSeeker.id, 'hidden');
  const {
    jobs: savedJobs,
    count: savedJobsCount,
    refetch: refetchSavedJobs
  } = useMarkedJobs(jobSeeker.id, 'saved');

  return (
    <>
      <h1>Dashboard</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={4}
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
              key={3}
              selected={card === 'marked_jobs'}
              onClick={() => setCard('marked_jobs')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaEyeSlash />
                  </div>
                  Marked Jobs
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
            {card === 'marked_jobs' && (
              <div className="flex flex-col justify-center">
                <Section title="Saved Jobs">
                  {savedJobs?.length ? (
                    <MarkedJobsTable
                      jobSeekerId={jobSeeker.id}
                      jobs={savedJobs}
                      type="saved"
                      onAction={refetchSavedJobs}
                    />
                  ) : (
                    'No saved jobs'
                  )}
                </Section>
                <Section title="Hidden Jobs" isLast={true}>
                  {hiddenJobs?.length ? (
                    <MarkedJobsTable
                      jobSeekerId={jobSeeker.id}
                      jobs={hiddenJobs}
                      type="hidden"
                      onAction={refetchHiddenJobs}
                    />
                  ) : (
                    'No hidden jobs'
                  )}
                </Section>
              </div>
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
