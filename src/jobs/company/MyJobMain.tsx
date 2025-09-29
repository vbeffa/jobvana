import { capitalize } from 'lodash';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import TextArea from '../../inputs/TextArea';
import { MAX_SALARY, MIN_SALARY } from '../job_seekers/useJobs';
import { type ToUpdate } from '../utils';
import MyJobTitle from './MyJobTitle';
import SalaryRangeInput from './SalaryRangeInput';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';

export type MyJobMainProps = {
  job: ToUpdate;
  setJob: React.Dispatch<React.SetStateAction<Job>>;
  isEditing: boolean;
};

const MyJobMain = ({ job, setJob, isEditing }: MyJobMainProps) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });

  return (
    <div className="grid grid-cols-[15%_70%] gap-y-2">
      {!isEditing && (
        <>
          <div>Title:</div>
          <div>{job.title}</div>
          <div>Type</div>
          <div>{job.type}</div>
          <div>Description:</div>
          <div>{job.description}</div>
          <div>Status:</div>
          <div>{capitalize(job.status)}</div>
          <div>Salary:</div>
          <div className="flex flex-row gap-1">
            <div>{formatter.format(job.salary_low)}</div>
            <div>-</div>
            <div>{formatter.format(job.salary_high)}</div>
          </div>
        </>
      )}
      {isEditing && (
        <>
          <MyJobTitle title={job.title} handleUpdate={setJob} />
          <TextArea
            id="description"
            label="Description"
            value={job.description ?? undefined}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={Math.max(3, Math.ceil((job.description?.length ?? 0) / 82.0))}
            onChange={(description) => {
              setJob((job) => ({
                ...job,
                description
              }));
            }}
          />
          <StatusSelect
            status={job.status}
            onChange={(status) => {
              setJob((job) => ({
                ...job,
                status
              }));
            }}
          />
          <SalaryRangeInput
            low={job.salary_low}
            high={job.salary_high}
            onChangeLow={(minSalary) => {
              if (!minSalary) {
                return;
              }
              setJob((job) => ({
                ...job,
                salary_low: minSalary,
                salary_high:
                  job.salary_high && minSalary > job.salary_high
                    ? minSalary
                    : Math.min(job.salary_high, MAX_SALARY)
              }));
            }}
            onChangeHigh={(maxSalary) => {
              if (!maxSalary) {
                return;
              }
              setJob((job) => ({
                ...job,
                salary_high: maxSalary,
                salary_low:
                  job.salary_low && maxSalary < job.salary_low
                    ? maxSalary
                    : Math.max(job.salary_low, MIN_SALARY)
              }));
            }}
          />
        </>
      )}
    </div>
  );
};

export default MyJobMain;
