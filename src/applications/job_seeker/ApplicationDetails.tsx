import InterviewProcessDisplay from '../../companies/InterviewProcessDisplay';
import JobLink from '../../jobs/JobLink';
import Section from '../../Section';
import Status from '../Status';
import useApplication from './useApplication';

const ApplicationDetails = ({ id }: { id: number }) => {
  const { application } = useApplication({ id });

  if (!application) {
    return null;
  }

  return (
    <div className="mx-4">
      <h1>Application Details</h1>
      <Section title="Application">
        <div>
          Submitted: {new Date(application.created_at).toLocaleDateString()}
        </div>
        <div className="flex flex-row gap-1">
          Status: <Status {...application} />
        </div>
        <div>
          Job: <JobLink {...application.job} />
        </div>
        <div>
          Job Seeker: {application.jobSeeker.first_name}{' '}
          {application.jobSeeker.last_name}
        </div>
      </Section>

      <Section title="Interview Rounds" isLast={true}>
        {application.interviewProcess && (
          <div className="border-[0.5px] border-blue-300 rounded-lg mt-2 px-4 py-4">
            <InterviewProcessDisplay
              interviewProcess={application.interviewProcess}
            />
          </div>
        )}
      </Section>
    </div>
  );
};

export default ApplicationDetails;
