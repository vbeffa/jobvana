import type { Job } from '../hooks/useJobs';

const JobSummary = ({
  job,
  selected,
  onClick
}: {
  job: Job;
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      key={job.id}
      className={`h-24 p-2 ${selected ? 'bg-gray-200' : ''} cursor-pointer`}
      onClick={onClick}
    >
      <div className="text-blue-500">{job.title}</div>
      <div className="text-sm">{job.company?.name}</div>
      <div className="text-sm">{job.role?.name}</div>
    </div>
  );
};

export default JobSummary;
