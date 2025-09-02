import useInterview from '../hooks/useInterview';

const InterviewDetails = ({ id }: { id: number }) => {
  const { interview } = useInterview({ id });

  if (!interview) {
    return null;
  }

  return (
    <>
      <h2>Application</h2>
      <div className="card text-left">{interview.application_id}</div>
      <h2>Status</h2>
      <div className="card text-left">{interview.status}</div>
    </>
  );
};

export default InterviewDetails;
