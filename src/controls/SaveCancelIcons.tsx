import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaX } from 'react-icons/fa6';

const SaveCancelIcons = ({
  disabled,
  onSave,
  onCancel
}: {
  disabled: boolean;
  onSave: () => void;
  onCancel: () => void;
}) => {
  return (
    <IconContext.Provider
      value={{
        style: {
          backgroundColor: 'var(--color-gray-100)'
        }
      }}
    >
      <div className="absolute right-0 top-2 flex flex-row gap-2">
        <button className="text-blue-400 cursor-pointer" onClick={onCancel}>
          <FaX />
        </button>

        <button
          className={`${disabled ? 'text-gray-400' : 'text-blue-400 cursor-pointer'}`}
          disabled={disabled}
          onClick={onSave}
        >
          <FaFloppyDisk />
        </button>
      </div>
    </IconContext.Provider>
  );
};

export default SaveCancelIcons;
