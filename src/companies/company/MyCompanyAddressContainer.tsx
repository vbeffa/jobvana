import { type JSX } from 'react';

const MyCompanyAddressContainer = ({
  children
}: {
  children: Array<JSX.Element>;
}) => {
  return (
    <div className="bg-gray-100 p-4 border-[0.5px] border-gray-400 rounded-lg w-96 h-57">
      {children}
    </div>
  );
};

export default MyCompanyAddressContainer;
