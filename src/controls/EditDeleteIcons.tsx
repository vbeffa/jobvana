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
  onSave
}: {
  type?: 'address' | 'job';
  isEditing: boolean;
  disabled?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSave: () => Promise<void>;
}) => {
  return (
    <IconContext.Provider
      value={{
        style: {
          backgroundColor: `var(--color-blue-300)`
        }
      }}
    >
      <div className="flex flex-row gap-2 items-center">
        {isEditing && (
          <>
            <button className={ICON_STYLE} onClick={onCancel}>
              <FaX />
            </button>
            <button className={ICON_STYLE} disabled={disabled} onClick={onSave}>
              <FaFloppyDisk />
            </button>
          </>
        )}
        {!isEditing && (
          <>
            <button className={ICON_STYLE} disabled={disabled} onClick={onEdit}>
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
