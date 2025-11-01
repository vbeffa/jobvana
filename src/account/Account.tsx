import { useContext } from 'react';
import { FaTools } from 'react-icons/fa';
import { FaFile, FaLock, FaPerson } from 'react-icons/fa6';
import { getUserType } from '../auth/utils';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import { JobSeekerContext, JobvanaContext } from '../Context';
import useSkillsForJobSeeker from '../job_seekers/useSkillsForJobSeeker';
import SummaryCard from '../SummaryCard';
import ChangePassword from './ChangePassword';
import JobSeekerResumes from './job_seekers/Resumes';
import JobSeekerSkills from './job_seekers/Skills';
import Profile from './Profile';

const Account = () => {
  const userType = getUserType();
  const { accountNav, setAccountNav } = useContext(JobvanaContext);
  const { jobSeeker } = useContext(JobSeekerContext);
  const { count: skillsCount } = useSkillsForJobSeeker(jobSeeker?.id ?? 0);

  if (userType === undefined || (userType === 'job_seeker' && !jobSeeker)) {
    return null;
  }

  return (
    <>
      <h1>Account Details</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer bannerType="title" hasPageNav={false}>
            {jobSeeker ? (
              <>
                <SummaryCard
                  key={4}
                  selected={accountNav === 'resumes'}
                  onClick={() => setAccountNav('resumes')}
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
                  selected={accountNav === 'skills'}
                  onClick={() => setAccountNav('skills')}
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
                  selected={accountNav === 'profile'}
                  onClick={() => setAccountNav('profile')}
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
              selected={accountNav === 'account'}
              onClick={() => setAccountNav('account')}
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
            {accountNav === 'account' && <ChangePassword />}
            {jobSeeker && (
              <>
                {accountNav === 'profile' && <Profile jobSeeker={jobSeeker} />}
                {accountNav === 'skills' && (
                  <JobSeekerSkills jobSeeker={jobSeeker} />
                )}
                {accountNav === 'resumes' && (
                  <JobSeekerResumes jobSeeker={jobSeeker} />
                )}
              </>
            )}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Account;
