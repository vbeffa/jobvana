import useApplicationsForJobSeeker from './useApplicationsForJobSeeker';

const useApplication = ({ id }: { id: number }) => {
  const { applications } = useApplicationsForJobSeeker({ jobSeekerId: 2 });

  return {
    application: applications?.find((application) => application.id === id)
  };
};

export default useApplication;
