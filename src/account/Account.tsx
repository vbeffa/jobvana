import { useContext, useState } from 'react';
import { getUserType } from '../auth/utils';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../Context';
import SummaryCard from '../SummaryCard';
import ChangePassword from './ChangePassword';
import Profile from './Profile';

const Account = () => {
  const [card, setCard] = useState('account');
  const { jobSeeker } = useContext(JobSeekerContext);
  const userType = getUserType();
  console.log(jobSeeker);

  return (
    <div className="mx-4">
      <h1>Account Details</h1>
      <ResourcesContainer hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'account'}
              onClick={() => setCard('account')}
              title="Security"
              text="Change your password"
              borderBottom={true}
            />
            {userType === 'job_seeker' ? (
              <SummaryCard
                key={2}
                selected={card === 'profile'}
                onClick={() => setCard('profile')}
                title="Profile"
                text="Update your name"
                borderBottom={true}
              />
            ) : (
              <></>
            )}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {card === 'account' && <ChangePassword />}
            {card === 'profile' && jobSeeker && (
              <Profile jobSeeker={jobSeeker} />
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Account;
