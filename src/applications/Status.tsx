import { capitalize } from 'lodash';
import {
  FaCircleCheck,
  FaNewspaper,
  FaPaperPlane,
  FaRegCircleXmark
} from 'react-icons/fa6';
import { MdOutlinePending } from 'react-icons/md';
import { PiHandWithdraw } from 'react-icons/pi';
import type { ApplicationStatus, InterviewRoundStatus } from '../types';

const Status = ({
  status
}: {
  status: ApplicationStatus | InterviewRoundStatus | 'created';
}) => {
  const icon = (() => {
    switch (status) {
      case 'created':
        return <FaNewspaper />;
      case 'submitted':
        return <FaPaperPlane />;
      case 'accepted':
        return <FaCircleCheck />;
      case 'withdrawn':
        return <PiHandWithdraw />;
      case 'declined':
        return <FaRegCircleXmark />;
      case 'pending':
        return <MdOutlinePending />;
    }
  })();

  return (
    <div className="flex flex-row items-center gap-1">
      {icon} {capitalize(status)}
    </div>
  );
};

export default Status;
