import { capitalize } from 'lodash';
import { FaCircleCheck, FaPaperPlane, FaRegCircleXmark } from 'react-icons/fa6';
import { PiHandWithdraw } from 'react-icons/pi';
import type { ApplicationStatus } from '../types';

const Status = ({ status }: { status: ApplicationStatus }) => {
  const icon = (() => {
    switch (status) {
      case 'submitted':
        return <FaPaperPlane />;
      case 'accepted':
        return <FaCircleCheck />;
      case 'withdrawn':
        return <PiHandWithdraw />;
      case 'declined':
        return <FaRegCircleXmark />;
    }
  })();

  return (
    <div className="flex flex-row items-center gap-1">
      {icon} {capitalize(status)}
    </div>
  );
};

export default Status;
