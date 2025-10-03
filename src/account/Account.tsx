import { useContext, useState } from 'react';
import { getUserType } from '../auth/utils';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import { JobSeekerContext } from '../Context';
import ProfileSkills from '../job_seekers/JobSeekerSkills';
import useSkillsForJobSeeker from '../job_seekers/useSkillsForJobSeeker';
import SummaryCard from '../SummaryCard';
import ChangePassword from './ChangePassword';
import Profile from './Profile';

const Account = () => {
  const [card, setCard] = useState('skills');
  const { jobSeeker } = useContext(JobSeekerContext);
  const userType = getUserType();
  const { count } = useSkillsForJobSeeker(jobSeeker?.id ?? 0);
  console.log(count);

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
              <>
                <SummaryCard
                  key={2}
                  selected={card === 'profile'}
                  onClick={() => setCard('profile')}
                  title="Profile"
                  text="Update your name"
                  borderBottom={true}
                />
                <SummaryCard
                  key={3}
                  selected={card === 'skills'}
                  onClick={() => setCard('skills')}
                  title="Skills"
                  text={`${count ? 'Update' : 'Add'} your skills`}
                  borderBottom={true}
                />
              </>
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
            {card === 'skills' && jobSeeker && (
              <ProfileSkills jobSeeker={jobSeeker} />
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Account;
