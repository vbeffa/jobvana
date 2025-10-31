import { type JSX } from 'react';

const MyCompanyAddressContainer = ({
  children,
  isEditing
}: {
  children: Array<JSX.Element>;
  isEditing: boolean;
}) => {
  return (
    // TODO resize using isEditing
    <div
      className={`bg-gray-100 border-[0.5px] border-gray-400 rounded-lg ${isEditing ? 'w-90 h-64' : 'w-90 h-64'} overflow-hidden`}
    >
      {children}
    </div>
  );
};

export default MyCompanyAddressContainer;
