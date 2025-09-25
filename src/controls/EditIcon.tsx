import { IconContext } from 'react-icons';
import { FaFloppyDisk, FaPencil, FaX } from 'react-icons/fa6';

const EditDeleteIcons = ({
  isEditing,
  setIsEditing,
  disabled,
  onEdit,
  onSave,
  bgColor = '--color-gray-100'
}: {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  onEdit: () => void;
  onSave: () => void;
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
          <button
            className="text-blue-400 cursor-pointer"
            onClick={() => setIsEditing(false)}
          >
            <FaX />
          </button>
        )}
        <button
          className={`${disabled ? 'text-gray-400' : 'text-blue-400 cursor-pointer'}`}
          disabled={disabled}
          onClick={() => {
            setIsEditing((isEditing) => {
              if (isEditing) {
                onSave();
              } else {
                onEdit();
              }
              return !isEditing;
            });
          }}
        >
          {!isEditing && <FaPencil />}
          {isEditing && <FaFloppyDisk />}
        </button>
      </div>
    </IconContext.Provider>
  );
};

export default EditDeleteIcons;
