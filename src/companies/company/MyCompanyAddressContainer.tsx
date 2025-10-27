import { type JSX } from 'react';

const MyCompanyAddressContainer = ({
  children
}: {
  children: Array<JSX.Element>;
}) => {
  return (
    <div className="bg-gray-100 border-[0.5px] border-gray-400 rounded-lg w-90 h-64 overflow-hidden">
      {children}
    </div>
  );
};

export default MyCompanyAddressContainer;
