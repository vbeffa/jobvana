import { capitalize } from 'lodash';
import { useMemo } from 'react';
import type {
  ApplicationStatus,
  InterviewRoundStatus,
  InterviewStatus
} from '../types';
import { getIcon } from './utils';

// TODO split out Event component for application events
const Status = ({
  status
}: {
  status:
    | ApplicationStatus
    | InterviewStatus
    | InterviewRoundStatus
    | 'created'
    | 'round_accepted'
    | 'round_declined';
}) => {
  const statusText = useMemo(() => {
    switch (status) {
      case 'in_process':
        return 'In Process';
      case 'round_accepted':
        return 'Round Accepted';
      case 'round_declined':
        return 'Round Declined';
      default:
        return capitalize(status);
    }
  }, [status]);

  return (
    <div className="flex flex-row items-center gap-1">
      {getIcon(status)} {statusText}
    </div>
  );
};

export default Status;
