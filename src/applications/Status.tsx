import { capitalize } from 'lodash';
import type { ApplicationStatus, InterviewRoundStatus } from '../types';
import { getIcon } from './utils';

const Status = ({
  status
}: {
  status: ApplicationStatus | InterviewRoundStatus | 'created';
}) => {
  return (
    <div className="flex flex-row items-center gap-1">
      {getIcon(status)} {capitalize(status)}
    </div>
  );
};

export default Status;
