import { FaBuilding, FaUser } from 'react-icons/fa6';
import type {
  ApplicationStatus,
  Company as DbCompany,
  JobSeeker as DbJobSeeker
} from '../types';

export type JobSeeker = Pick<DbJobSeeker, 'first_name' | 'last_name'>;
export type Company = Pick<DbCompany, 'name'>;

const applicationEventUser = (
  event: ApplicationStatus,
  jobSeeker: JobSeeker,
  company: Company
) => {
  switch (event) {
    case 'submitted':
    case 'withdrawn':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaUser />
          {jobSeeker.first_name} {jobSeeker.last_name}
        </div>
      );
    case 'accepted':
    case 'declined':
      return (
        <div className="flex flex-row items-center gap-1">
          <FaBuilding />
          {company.name}
        </div>
      );
  }
};

export { applicationEventUser };
