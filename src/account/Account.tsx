import { useContext, useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { FaFile, FaLock, FaPerson } from 'react-icons/fa6';
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
  const [card, setCard] = useState<'account' | 'profile' | 'skills' | 'resume'>(
    'resume'
  );
  const { jobSeeker } = useContext(JobSeekerContext);
  const userType = getUserType();
  const { count: skillsCount } = useSkillsForJobSeeker(jobSeeker?.id ?? 0);

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
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaLock />
                  </div>
                  Security
                </div>
              }
              text="Change your password"
              borderBottom={true}
            />
            {userType === 'job_seeker' ? (
              <>
                <SummaryCard
                  key={2}
                  selected={card === 'profile'}
                  onClick={() => setCard('profile')}
                  title={
                    <div className="flex flex-row gap-1">
                      <div className="content-center">
                        <FaPerson />
                      </div>
                      Profile
                    </div>
                  }
                  text="Update your name"
                  borderBottom={true}
                />
                <SummaryCard
                  key={3}
                  selected={card === 'skills'}
                  onClick={() => setCard('skills')}
                  title={
                    <div className="flex flex-row gap-1">
                      <div className="content-center">
                        <FaTools />
                      </div>
                      Skills
                    </div>
                  }
                  text={
                    skillsCount && skillsCount > 0
                      ? `${skillsCount} current`
                      : 'Select your skills'
                  }
                  borderBottom={true}
                />
                <SummaryCard
                  key={4}
                  selected={card === 'resume'}
                  onClick={() => setCard('resume')}
                  title={
                    <div className="flex flex-row gap-1">
                      <div className="content-center">
                        <FaFile />
                      </div>
                      Resume
                    </div>
                  }
                  text="Upload your resume"
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
