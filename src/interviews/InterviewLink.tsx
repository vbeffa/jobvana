import { Link } from '@tanstack/react-router';
import type { Interview } from '../hooks/types';

const InterviewLink = ({ interview }: { interview: Interview }) => {
  return (
    <Link to="/jobvana/interviews/$id" params={{ id: interview.id.toString() }}>
      {interview.application_id}
    </Link>
  );
};

export default InterviewLink;
