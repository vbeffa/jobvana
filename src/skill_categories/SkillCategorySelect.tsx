import useSkillCategories from './useSkillCategories';

const SkillCategorySelect = ({
  elementId,
  skillCategoryId,
  onChange
}: {
  elementId: string;
  skillCategoryId?: number;
  onChange: (skillId: number) => void;
}) => {
  const { skillCategories, isPending } = useSkillCategories();

  return (
    <select
      id={elementId}
      className="border border-gray-500 rounded-lg h-8 w-60 px-2 py-0.5"
      value={skillCategoryId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {isPending && (
        <option key={0} value="0">
          Loading...
        </option>
      )}
      {!isPending && (
        <option key={0} value="0">
          Any
        </option>
      )}
      {skillCategories?.map((skillCategory, idx) => (
        <option key={idx} value={skillCategory.id}>
          {skillCategory.name}
        </option>
      ))}
    </select>
  );
};

export default SkillCategorySelect;
