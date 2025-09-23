import Button from './Button';

const EditButtons = ({
  editMode,
  setEditMode,
  disabled,
  onEdit,
  onSave
}: {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
  onEdit: () => void;
  onSave: () => void;
}) => {
  return (
    <div className="absolute ml-4 right-0 top-0 flex flex-row gap-2">
      {editMode && <Button label="Cancel" onClick={() => setEditMode(false)} />}
      <Button
        label={`${editMode ? 'Save' : 'Edit'}`}
        disabled={disabled}
        onClick={() =>
          setEditMode((editMode) => {
            if (editMode) {
              onSave();
            } else {
              onEdit();
            }
            return !editMode;
          })
        }
      />
    </div>
  );
};

export default EditButtons;
