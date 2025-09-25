import type { JSX } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa6';

const PillContainer = ({
  children,
  showDeleteIcon,
  onDelete,
  showAddIcon,
  onAdd
}: {
  children: JSX.Element | string;
  showDeleteIcon?: boolean;
  onDelete?: () => void;
  showAddIcon?: boolean;
  onAdd?: () => void;
}) => {
  return (
    <div className="relative border-[1px] border-blue-500 bg-blue-200 w-fit flex gap-1 whitespace-nowrap">
      <div className="p-1">{children}</div>
      {showDeleteIcon && (
        <div
          className="border-l px-1 text-sm text-blue-500 content-center cursor-pointer"
          onClick={onDelete}
        >
          <div className="hover:text-blue-400">
            <FaTrash />
          </div>
        </div>
      )}
      {showAddIcon && (
        <div
          className="border-l px-1 text-sm text-blue-500 content-center cursor-pointer"
          onClick={onAdd}
        >
          <div className="hover:text-blue-400">
            <FaPlus />
          </div>
        </div>
      )}
    </div>
  );
};

export default PillContainer;
