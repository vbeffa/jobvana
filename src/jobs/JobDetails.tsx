import CompanyLink from '../companies/CompanyLink';
import Error from '../Error';
import useJob from '../hooks/useJob';
import LoadingModal from '../LoadingModal';
import JobSkills from './JobSkills';
import Salary from './Salary';

const JobDetails = ({ id }: { id: number }) => {
  const { job, error, isPlaceholderData, isPending } = useJob({ id });

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!job) {
    return null;
  }

  return (
    <div className="px-4">
      {isPlaceholderData && <LoadingModal />}
      <h2>{job.title}</h2>
      <h2>Company</h2>
      <div className="card text-left">
        {job.company && <CompanyLink company={job.company} />}
      </div>
      <h2>Description</h2>
      <div className="card text-left">{job.description}</div>
      <h2>Created</h2>
      <div className="card text-left">
        {new Date(job.created_at).toDateString()}
      </div>
      <h2>Status</h2>
      <div className="card text-left">{job.status}</div>
      <h2>Salary</h2>
      <div className="card text-left">
        <Salary job={job} />
      </div>

      <h2>Skills</h2>
      <div className="card text-left">
        <JobSkills job={job} />
      </div>
    </div>
  );
};

export default JobDetails;
