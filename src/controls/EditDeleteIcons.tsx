import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaPencil, FaTrash, FaX } from 'react-icons/fa6';

const EditDeleteIcons = ({
  type,
  isEditing,
  // setIsEditing,
  disabled,
  onEdit,
  onCancel,
  onDelete,
  onSave,
  bgColor = '--color-white'
}: {
  type?: 'address' | 'job';
  isEditing: boolean;
  // setIsEditing: (editing: boolean) => void;
  disabled?: boolean;
  onEdit: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  onSave?: () => Promise<void>;
  bgColor?: '--color-white' | '--color-gray-100';
}) => {
  const enabledStyle = 'text-blue-400 cursor-pointer';
  const disabledStyle = 'text-gray-400';

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
              className={enabledStyle}
              onClick={() => {
                // setIsEditing(false);
                if (onCancel) {
                  onCancel();
                }
              }}
            >
              <FaX />
            </button>
            {onSave && (
              <button
                className={`${disabled ? disabledStyle : enabledStyle}`}
                disabled={disabled}
                onClick={async () => {
                  // setIsEditing(false);
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
              className={`${disabled ? disabledStyle : enabledStyle}`}
              disabled={disabled}
              onClick={() => {
                // setIsEditing(true);
                onEdit();
              }}
            >
              <FaPencil />
            </button>
            {onDelete && (
              <button
                className={enabledStyle}
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
