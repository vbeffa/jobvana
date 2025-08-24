import useJobs from "./useJobs";

const useJob = ({ id }: { id: number }) => {
  const { jobs } = useJobs();

  return {
    job: jobs?.find((job) => job.id === id)
  };
};

export default useJob;
