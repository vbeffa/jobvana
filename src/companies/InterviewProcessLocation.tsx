import { capitalize } from 'lodash';
import { FaBuilding, FaHome, FaPhone, FaVideo } from 'react-icons/fa';
import type { RoundLocation } from './company/utils';

const InterviewProcessLocation = ({
  location
}: {
  location: RoundLocation;
}) => {
  return (
    <div className="flex flex-row gap-1">
      <div className="text-blue-400 content-center">
        {location === 'video' && <FaVideo />}
        {location === 'phone' && <FaPhone />}
        {location === 'offline' && <FaHome />}
        {location === 'office' && <FaBuilding />}
      </div>
      {capitalize(location)}
    </div>
  );
};

export default InterviewProcessLocation;
