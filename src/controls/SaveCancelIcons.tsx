import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaX } from 'react-icons/fa6';
import { ICON_STYLE } from './styles';

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
          backgroundColor: 'var(--color-blue-300)'
        }
      }}
    >
      <div className="flex flex-row gap-2">
        <button className={ICON_STYLE} onClick={onCancel}>
          <FaX />
        </button>

        <button className={ICON_STYLE} disabled={disabled} onClick={onSave}>
          <FaFloppyDisk />
        </button>
      </div>
    </IconContext.Provider>
  );
};

export default SaveCancelIcons;
