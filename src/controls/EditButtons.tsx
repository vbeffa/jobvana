import Button from './Button';

const EditButtons = ({
  isEditing,
  setIsEditing,
  disabled,
  onEdit,
  onCancel,
  onSave
}: {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  onEdit: () => void;
  onCancel?: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="absolute ml-4 right-0 top-0 flex flex-row gap-2">
      {isEditing && (
        <Button
          label="Cancel"
          onClick={() => {
            setIsEditing(false);
            if (onCancel) {
              onCancel();
            }
          }}
        />
      )}
      <Button
        label={`${isEditing ? 'Save' : 'Edit'}`}
        disabled={disabled}
        onClick={() => {
          setIsEditing(!isEditing);
          if (isEditing) {
            onSave();
          } else {
            onEdit();
          }
        }}
      />
    </div>
  );
};

export default EditButtons;
