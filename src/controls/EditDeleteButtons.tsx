import Button from './Button';

const EditDeleteButtons = ({
  type,
  isEditing,
  disabled,
  onEdit,
  onCancel,
  onDelete,
  onSave
}: {
  type?: 'job';
  isEditing: boolean;
  disabled: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="absolute ml-4 right-0 top-0 flex flex-row gap-2">
      {isEditing && <Button label="Cancel" onClick={onCancel} />}
      <Button
        label={`${isEditing ? 'Save' : 'Edit'}`}
        disabled={disabled}
        onClick={() => {
          if (isEditing) {
            onSave();
          } else {
            onEdit();
          }
        }}
      />
      {!isEditing && onDelete && (
        <Button
          label="Delete"
          onClick={() => {
            if (
              window.confirm(`Are you sure you want to delete this ${type}?`)
            ) {
              onDelete();
            }
          }}
        />
      )}
    </div>
  );
};

export default EditDeleteButtons;
