import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaPencil, FaTrash, FaX } from 'react-icons/fa6';
import { ICON_STYLE } from './styles';

const EditDeleteIcons = ({
  type,
  isEditing,
  disabled,
  onEdit,
  onCancel,
  onDelete,
  onSave,
  bgColor = '--color-white'
}: {
  type?: 'address' | 'job';
  isEditing: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onSave?: () => Promise<void>;
  bgColor?: '--color-white' | '--color-gray-100';
}) => {
  return (
    <IconContext.Provider
      value={{
        style: {
          backgroundColor: `var(${bgColor})`
        }
      }}
    >
      <div className="absolute right-0 top-2 flex flex-row gap-2">
        {isEditing && (
          <>
            <button
              className={ICON_STYLE}
              onClick={() => {
                if (onCancel) {
                  onCancel();
                }
              }}
            >
              <FaX />
            </button>
            {onSave && (
              <button
                className={ICON_STYLE}
                disabled={disabled}
                onClick={async () => {
                  await onSave();
                }}
              >
                <FaFloppyDisk />
              </button>
            )}
          </>
        )}
        {!isEditing && (
          <>
            <button
              className={ICON_STYLE}
              disabled={disabled}
              onClick={() => {
                onEdit();
              }}
            >
              <FaPencil />
            </button>
            {onDelete && (
              <button
                className={ICON_STYLE}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete this ${type}?`
                    )
                  ) {
                    onDelete();
                  }
                }}
              >
                <FaTrash />
              </button>
            )}
          </>
        )}
      </div>
    </IconContext.Provider>
  );
};

export default EditDeleteIcons;
