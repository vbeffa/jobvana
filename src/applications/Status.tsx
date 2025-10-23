import { capitalize } from 'lodash';
import type {
  ApplicationStatus,
  InterviewRoundStatus,
  InterviewStatus
} from '../types';
import { getIcon } from './utils';

const Status = ({
  status
}: {
  status:
    | ApplicationStatus
    | InterviewStatus
    | InterviewRoundStatus
    | 'created';
}) => {
  return (
    <div className="flex flex-row items-center gap-1">
      {getIcon(status)}{' '}
      {capitalize(status === 'in_process' ? 'in process' : status)}
    </div>
  );
};

export default Status;
