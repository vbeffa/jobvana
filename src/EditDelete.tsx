import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaPencil, FaTrash, FaX } from 'react-icons/fa6';

const EditDelete = ({
  editMode,
  setEditMode,
  disabled,
  onEdit,
  onDelete,
  onSave
}: {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
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
        {editMode && (
          <button
            className="text-blue-400 cursor-pointer"
            onClick={() => setEditMode(false)}
          >
            <FaX />
          </button>
        )}
        <button
          className={`${disabled ? 'text-gray-400' : 'text-blue-400 cursor-pointer'}`}
          disabled={disabled}
          onClick={() => {
            setEditMode((editMode) => {
              if (editMode) {
                onSave();
              } else {
                onEdit();
              }
              return !editMode;
            });
          }}
        >
          {!editMode && <FaPencil />}
          {editMode && <FaFloppyDisk />}
        </button>
        {!editMode && (
          <button
            className="text-blue-400 cursor-pointer"
            onClick={() => {
              if (
                window.confirm('Are you sure you want to delete this address?')
              ) {
                onDelete();
              }
            }}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </IconContext.Provider>
  );
};

export default EditDelete;
