import { Route } from '../routes/jobvana.interviews.$id';
import InterviewDetails from './InterviewDetails';

const Interview = () => {
  const { id } = Route.useLoaderData();

  return <InterviewDetails id={id} />;
};

export default Interview;
