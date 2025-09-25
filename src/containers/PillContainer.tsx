import type { JSX } from 'react';
import { FaX } from 'react-icons/fa6';

const PillContainer = ({
  children,
  showX,
  onClickX
}: {
  children: JSX.Element | string;
  showX?: boolean;
  onClickX?: () => void;
}) => {
  return (
    <div className="relative border-[1px] border-blue-500 bg-blue-200 w-fit flex gap-1 whitespace-nowrap">
      <div className="p-1">{children}</div>
      {showX && (
        <div
          className="border-l px-1 text-sm text-blue-500 content-center cursor-pointer"
          onClick={onClickX}
        >
          <div className="hover:text-blue-400">
            <FaX />
          </div>
        </div>
      )}
    </div>
  );
};

export default PillContainer;
