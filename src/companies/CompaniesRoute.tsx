import { getUserType } from '../auth/utils';
import Companies from './job_seeker/Companies';

const CompaniesRoute = () => {
  const userType = getUserType();

  return userType === 'job_seeker' ? <Companies /> : null;
};

export default CompaniesRoute;
