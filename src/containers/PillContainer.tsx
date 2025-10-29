import type { JSX } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCheck, FaPlus, FaTrash, FaX } from 'react-icons/fa6';
import Tooltip from '../inputs/Tooltip';

const PillContainer = ({
  children,
  tooltipMessage,
  type,
  onDelete,
  onAdd,
  checked
}: {
  children: JSX.Element | string;
  tooltipMessage?: string;
  type?: 'add' | 'delete' | 'check';
  onDelete?: () => void;
  onAdd?: () => void;
  checked?: boolean;
}) => {
  const style =
    'border-l px-1 text-sm text-blue-500 content-center cursor-pointer';

  return (
    <div
      className={`border border-blue-500 ${
        checked ? 'bg-blue-300' : 'bg-blue-200'
      } h-fit w-fit flex gap-1 whitespace-nowrap cursor-default`}
    >
      {tooltipMessage && (
        <div className="p-1 relative">
          <Tooltip message={tooltipMessage} pos="top-[75%] left-[50%]">
            {children}
          </Tooltip>
        </div>
      )}
      {!tooltipMessage && <div className="p-1">{children}</div>}
      {type === 'delete' && onDelete && (
        <div className={style} onClick={onDelete}>
          <div className="hover:text-blue-400">
            <FaTrash />
          </div>
        </div>
      )}
      {type === 'add' && onAdd && (
        <div className={style} onClick={onAdd}>
          <div className="hover:text-blue-400">
            <FaPlus />
          </div>
        </div>
      )}
      {type === 'check' && onDelete && onAdd && (
        <div className={style} onClick={() => (checked ? onDelete() : onAdd())}>
          <div className="hover:text-blue-400">
            {checked ? <FaCheckCircle /> : <FaCheck />}
          </div>
        </div>
      )}
      {type === undefined && onDelete && onAdd === undefined && (
        <div className={style} onClick={onDelete}>
          <div className="hover:text-blue-400">
            <FaX />
          </div>
        </div>
      )}
    </div>
  );
};

export default PillContainer;
