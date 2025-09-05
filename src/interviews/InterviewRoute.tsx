import { Route } from '../routes/jobvana.interviews.$id';
import InterviewDetails from './InterviewDetails';

const InterviewRoute = () => {
  const { id } = Route.useLoaderData();

  return <InterviewDetails id={id} />;
};

export default InterviewRoute;
