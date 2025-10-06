import useApplications from './useApplications';

const useApplication = ({ id }: { id: number }) => {
  const { applications } = useApplications({ jobSeekerId: 2 });

  return {
    application: applications?.find((application) => application.id === id)
  };
};

export default useApplication;
