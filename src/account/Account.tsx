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
import Resumes from '../job_seekers/Resumes';
import useSkillsForJobSeeker from '../job_seekers/useSkillsForJobSeeker';
import SummaryCard from '../SummaryCard';
import ChangePassword from './ChangePassword';
import Profile from './Profile';

const Account = () => {
  const userType = getUserType();
  const [card, setCard] = useState<
    'account' | 'profile' | 'skills' | 'resumes'
  >(userType === 'company' ? 'account' : 'resumes');
  const { jobSeeker } = useContext(JobSeekerContext);
  const { count: skillsCount } = useSkillsForJobSeeker(jobSeeker?.id ?? 0);

  if (userType === undefined || (userType === 'job_seeker' && !jobSeeker)) {
    return null;
  }

  return (
    <div className="mx-4">
      <h1>Account Details</h1>
      <ResourcesContainer hasTitle={true}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            {jobSeeker ? (
              <>
                <SummaryCard
                  key={4}
                  selected={card === 'resumes'}
                  onClick={() => setCard('resumes')}
                  title={
                    <div className="flex flex-row gap-1">
                      <div className="content-center">
                        <FaFile />
                      </div>
                      Resumes
                    </div>
                  }
                  text="Manage your resumes"
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
                  text={`${jobSeeker.first_name} ${jobSeeker.last_name}`}
                  borderBottom={true}
                />
              </>
            ) : (
              <></>
            )}
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
            {card === 'resumes' && jobSeeker && (
              <Resumes jobSeeker={jobSeeker} />
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Account;
