import { capitalize } from 'lodash';
import { useMemo } from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import TextArea from '../../inputs/TextArea';
import { jobTypeToString } from '../utils';
import JobTypeSelect from './JobTypeSelect';
import MyJobTitle from './MyJobTitle';
import SalaryRangeInput from './SalaryRangeInput';
import SalaryTypeSelect from './SalaryTypeSelect';
import StatusSelect from './StatusSelect';
import type { Job } from './useJobsForCompany';
import { maxJobSalary, minJobSalary, type ToUpdate } from './utils';

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

  const minSalary = useMemo(
    () => minJobSalary(job.salary_type),
    [job.salary_type]
  );

  const maxSalary = useMemo(
    () => maxJobSalary(job.salary_type),
    [job.salary_type]
  );

  return (
    <div className="grid grid-cols-[15%_70%] gap-y-2">
      {!isEditing && (
        <>
          <div>Title:</div>
          <div>{job.title}</div>
          <div>Description:</div>
          <div>{job.description}</div>
          <div>Type</div>
          <div className="flex flex-row">
            <div className="w-[40%]">{jobTypeToString(job.type)}</div>
            <div className="w-[20%]">Status:</div>
            <div>{capitalize(job.status)}</div>
          </div>
          <div>Salary Type:</div>
          <div className="flex flex-row">
            <div className="w-[40%]">{capitalize(job.salary_type)}</div>
            <div className="w-[20%]">Salary:</div>
            <div className="flex flex-row gap-1">
              <div>{formatter.format(job.salary_low)}</div>
              <div>-</div>
              <div>{formatter.format(job.salary_high)}</div>
            </div>
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
          <label htmlFor="job_type" className="content-center">
            Job Type:
          </label>
          <div className="flex flex-row">
            <div className="w-[30%]">
              <JobTypeSelect
                value={job.type}
                onChange={(type) => {
                  setJob((job) => ({
                    ...job,
                    type
                  }));
                }}
              />
            </div>
            <label htmlFor="status" className="w-[20%] content-center">
              Status:
            </label>
            <StatusSelect
              status={job.status}
              onChange={(status) => {
                setJob((job) => ({
                  ...job,
                  status
                }));
              }}
            />
          </div>
          <label htmlFor="salary_type" className="content-center">
            Salary Type:
          </label>
          <div className="flex flex-row">
            <div className="w-[30%]">
              <SalaryTypeSelect
                value={job.salary_type}
                onChange={(salaryType) => {
                  setJob((job) => ({
                    ...job,
                    salary_type: salaryType,
                    salary_low: minJobSalary(salaryType),
                    salary_high: maxJobSalary(salaryType)
                  }));
                }}
              />
            </div>
            <label htmlFor="min_salary" className="w-[20%] content-center">
              Salary:
            </label>
            <SalaryRangeInput
              type={job.salary_type}
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
                      : Math.min(job.salary_high, maxSalary)
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
                      : Math.max(job.salary_low, minSalary)
                }));
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyJobMain;
