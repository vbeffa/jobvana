import { FaFlag, FaInbox } from 'react-icons/fa6';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import { type Company } from '../../Context';
import SummaryCard from '../../SummaryCard';

const Dashboard = ({ company }: { company: Company }) => {
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
                  <FaFlag /> Alerts & Notifications
                </div>
              }
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>Welcome, {company.name}!</>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Dashboard;
