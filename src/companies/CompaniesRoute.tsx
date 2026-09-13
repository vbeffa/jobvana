import { useNavigate } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { JobvanaContext } from '../Context';
import Companies from './job_seeker/Companies';

const CompaniesRoute = () => {
  const navigate = useNavigate();
  const { userType } = useContext(JobvanaContext);

  useEffect(() => {
    if (userType === 'company') {
      navigate({ to: '/jobvana' });
    }
  }, [navigate, userType]);

  return userType === 'job_seeker' ? <Companies /> : null;
};

export default CompaniesRoute;
