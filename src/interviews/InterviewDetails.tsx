import useInterview from './useInterview';

const InterviewDetails = ({ id }: { id: number }) => {
  const { interview } = useInterview({ id });

  if (!interview) {
    return null;
  }

  return (
    <>
      <h2>Application</h2>
      <div>{interview.application_id}</div>
      <h2>Status</h2>
      {/* <div>{interview.status}</div> */}
    </>
  );
};

export default InterviewDetails;
