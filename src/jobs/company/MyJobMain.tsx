import { capitalize } from 'lodash';
import { useMemo } from 'react';
import { MAX_DESCRIPTION_LENGTH } from '../../companies/job_seeker/useCompanies';
import Label from '../../inputs/Label';
import TextArea from '../../inputs/TextArea';
import type { CompanyAddress } from '../../types';
import { formatCurrency } from '../../utils';
import { jobTypeToString, maxJobSalary, minJobSalary } from '../utils';
import JobTypeSelect from './JobTypeSelect';
import LocationSelect from './LocationSelect';
import MyJobTitle from './MyJobTitle';
import SalaryRangeInput from './SalaryRangeInput';
import SalaryTypeSelect from './SalaryTypeSelect';
import type { Job } from './useJobsForCompany';
import { type ToUpdate } from './utils';

export type MyJobMainProps = {
  job: ToUpdate;
  // isNew: boolean;
  // isDraft: boolean;
  setJob: React.Dispatch<React.SetStateAction<Job>>;
  // updateInterviewProcess: boolean;
  // setUpdateInterviewProcess: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: Array<CompanyAddress>;
  isEditing: boolean;
};

const MyJobMain = ({
  job,
  // isNew,
  // isDraft,
  setJob,
  // updateInterviewProcess,
  // setUpdateInterviewProcess,
  addresses,
  isEditing
}: MyJobMainProps) => {
  const minSalary = useMemo(
    () => minJobSalary(job.salary_type),
    [job.salary_type]
  );

  const maxSalary = useMemo(
    () => maxJobSalary(job.salary_type),
    [job.salary_type]
  );

  const jobAddress = useMemo(() => {
    const address = addresses.find(
      (address) => address.id === job.company_address_id
    );
    if (!address) {
      return 'Remote';
    }
    return `${address.street}, ${address.city} ${address.state} ${address.zip}`;
  }, [addresses, job.company_address_id]);

  return (
    <div className="grid grid-cols-[15%_85%] gap-y-2">
      {!isEditing && (
        <>
          <div>Title:</div>
          <div>{job.title}</div>
          <div>Description:</div>
          <div>{job.description}</div>
          <div>Type</div>
          <div className="flex flex-row">
            <div className="w-[40%]">{jobTypeToString(job.type)}</div>
            {/* <div className="w-[20%]">Status:</div>
            <div className="flex flex-row gap-1">
              <div className="content-center">
                {job.status === 'draft' && <MdOutlineUnpublished />}
                {job.status === 'open' && <MdCheckCircleOutline />}
              </div>
              {capitalize(job.status)}
            </div> */}
          </div>
          <div>Salary Type:</div>
          <div className="flex flex-row">
            <div className="w-[40%]">{capitalize(job.salary_type)}</div>
            <div className="w-[20%]">Salary:</div>
            <div className="flex flex-row gap-1">
              <div>{formatCurrency(job.salary_low)}</div>
              <div>-</div>
              <div>{formatCurrency(job.salary_high)}</div>
            </div>
          </div>
          <div>Location:</div>
          <div>{jobAddress}</div>
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
          <Label htmlFor="job_type" label="Job Type" />
          <div className="grid grid-cols-[30%_20%_30%]">
            <JobTypeSelect
              value={job.type}
              width="w-32"
              onChange={(type) => {
                setJob((job) => ({
                  ...job,
                  type
                }));
              }}
            />
            {/* <Label htmlFor="status" label="Status" />
            <StatusSelect
              status={job.status}
              isDraft={isDraft}
              onChange={(status) => {
                setJob((job) => ({
                  ...job,
                  status
                }));
              }}
            /> */}
          </div>
          <Label htmlFor="salary_type" label="Salary Type" />
          <div className="grid grid-cols-[30%_20%_30%]">
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
            <Label htmlFor="min_salary" label="Salary" />
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
          <Label htmlFor="location" label="Location" />
          <LocationSelect
            addressId={job.company_address_id ?? undefined}
            addresses={addresses}
            onChange={(addressId) => {
              setJob((job) => ({
                ...job,
                company_address_id: addressId
              }));
            }}
          />
          {/* <div className="flex flex-row gap-1 col-start-2">
            <div className="">
              <input
                id="update_interview_process"
                type="checkbox"
                checked={updateInterviewProcess}
                disabled={isNew}
                onChange={() => setUpdateInterviewProcess((update) => !update)}
              />
            </div>
            <label htmlFor="update_interview_process">
              Update interview process{' '}
              <span className="text-sm">
                (not available once an application has been submitted)
              </span>
            </label>
          </div> */}
        </>
      )}
    </div>
  );
};

export default MyJobMain;
