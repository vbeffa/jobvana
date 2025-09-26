import Button from './Button';

const EditButtons = ({
  isEditing,
  setIsEditing,
  disabled,
  onEdit,
  onSave
}: {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  onEdit: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="absolute ml-4 right-0 top-0 flex flex-row gap-2">
      {isEditing && (
        <Button label="Cancel" onClick={() => setIsEditing(false)} />
      )}
      <Button
        label={`${isEditing ? 'Save' : 'Edit'}`}
        disabled={disabled}
        onClick={() => {
          console.log('click', isEditing);
          if (isEditing) {
            onSave();
          } else {
            onEdit();
          }
          setIsEditing(!isEditing);
        }}
      />
    </div>
  );
};

export default EditButtons;
