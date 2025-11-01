import { Link } from '@tanstack/react-router';
import {
  FaBuilding,
  FaHatCowboy,
  FaPaperPlane,
  FaPersonChalkboard,
  FaWrench
} from 'react-icons/fa6';
import { IoCodeSlash } from 'react-icons/io5';
import { MdRoundaboutRight } from 'react-icons/md';
import Section from '../Section';
import { getIcon } from '../applications/utils';

const Definitions = () => {
  return (
    <div className="h-full px-4 pt-4 overflow-auto">
      <Section
        title={
          <div className="flex flex-row gap-1 items-center">
            <FaBuilding /> Companies
          </div>
        }
      >
        <>
          <Link to="/jobvana/companies">Companies</Link> have{' '}
          <Link to="." hash="jobs">
            jobs
          </Link>
          .
        </>
      </Section>
      <Section
        id="jobs"
        title={
          <div className="flex flex-row gap-1 items-center">
            <FaWrench /> Jobs
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div>
            <Link to="/jobvana/jobs">Jobs</Link> have titles which are free-form
            (defined by the company).
          </div>
          <div>
            Jobs have one or more{' '}
            <Link to="." hash="roles">
              roles
            </Link>
            . The exact ratio of each role depends on the job. Each role has a
            percentage (1 - 100) and a level (1 - 5).
          </div>
          <div>
            Jobs have one or more requirements which are a list of{' '}
            <Link to="." hash="skills">
              skills
            </Link>
            .
          </div>
          <div>
            Jobs have a status which is one of:
            <ul>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('draft')} draft - not published
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('open')} open - published, accepting applications
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('filled')} filled - job seeker hired
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('closed')} archived - closed without hiring
              </li>
            </ul>
          </div>
          <div>
            Jobs have an interview process which consists of up to 5 rounds and
            a pipeline. The pipeline is the maximum number of open applications
            (submitted or accepted) allowed for a job. The maximum pipeline size
            is 10.
          </div>
          <div>
            Jobs have{' '}
            <Link to="." hash="applications">
              applications
            </Link>
            .
          </div>
        </div>
      </Section>
      <Section
        id="roles"
        title={
          <div className="flex flex-row gap-1 items-center">
            <FaHatCowboy /> Roles
          </div>
        }
      >
        <>
          <Link to="/jobvana/roles">Roles</Link> are high-level descriptions of
          a job's duties.
        </>
      </Section>
      <Section
        id="skills"
        title={
          <div className="flex flex-row gap-1 items-center">
            <IoCodeSlash /> Skills
          </div>
        }
      >
        <>
          <Link to="/jobvana/skills">Skills</Link> are used in jobs. There is
          not a 1-1 relationship between skills and roles.
        </>
      </Section>
      <Section
        id="applications"
        title={
          <div className="flex flex-row gap-1 items-center">
            <FaPaperPlane /> Applications
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div>
            <Link to="/jobvana/applications">Applications</Link> have a status
            which is one of:
            <ul>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('submitted')} submitted by the job seeker
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('accepted')} accepted by the company
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('declined')} declined by the company
              </li>
              <li className="flex flex-row gap-2 items-center">
                • {getIcon('withdrawn')} withdrawn by the job seeker
              </li>
            </ul>
          </div>
          <div>
            Applications, once accepted, begin the{' '}
            <Link to="." hash="interviews">
              interview process
            </Link>
            .
          </div>
        </div>
      </Section>
      <Section
        id="interviews"
        title={
          <div className="flex flex-row gap-1 items-center">
            <FaPersonChalkboard /> Interviews
          </div>
        }
      >
        <div className="flex flex-col gap-2">
          <div>
            Interviews have{' '}
            <Link to="." hash="interview_rounds">
              interview rounds
            </Link>
            .
          </div>
          <div>
            Interviews have a status which is one of:
            <ul>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('pending')} pending - application is accepted but no
                rounds have been completed, and no feedback has been given
              </li>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('in_process')} in process - interview is ongoing and
                all received feedback is accepted
              </li>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('declined')} declined - round is declined by the job
                seeker or the company (this also declines the application)
              </li>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('completed')} completed - all rounds accepted by both
                the job seeker and the company (this should result in a job
                offer)
              </li>
            </ul>
          </div>
          <div>
            An application's interview process corresponds to the job's
            interview process.
          </div>
          <div>
            Each round requires approval from both the job seeker and the
            company to proceed to the next round.
          </div>
          <div>
            If either party declines the round, the application is marked as
            declined.
          </div>
        </div>
      </Section>
      <div className="mb-130">
        <Section
          id="interview_rounds"
          title={
            <div className="flex flex-row gap-1 items-center">
              <MdRoundaboutRight /> Interview Rounds
            </div>
          }
          isLast={true}
        >
          <div className="flex flex-col gap-2">
            Interview rounds have a status which is one of:
            <ul>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('pending')} pending - awaiting feedback from either
                the job seeker or the company or both
              </li>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('accepted')} accepted - both job seerk and company
                have accepted the round
              </li>
              <li className="w-fit flex flex-row gap-2 items-center whitespace-nowrap">
                • {getIcon('declined')} declined - either the job seeker or the
                company has declined the round
              </li>
            </ul>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Definitions;
