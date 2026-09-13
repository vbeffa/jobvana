import { Navigate } from '@tanstack/react-router';
import { useContext } from 'react';
import { JobvanaContext } from '../Context';
import Companies from './job_seeker/Companies';

const CompaniesRoute = () => {
  const { userType } = useContext(JobvanaContext);

  return userType === 'company' ? (
    <Navigate to="/jobvana" />
  ) : userType === 'job_seeker' ? (
    <Companies />
  ) : null;
};

export default CompaniesRoute;
