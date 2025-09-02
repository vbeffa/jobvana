import useInterviews from './useInterviews';

const useInterview = ({ id }: { id: number }) => {
  const { interviews } = useInterviews();

  return {
    interview: interviews?.find((interview) => interview.id === id)
  };
};

export default useInterview;
