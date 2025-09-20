import useSkillCategories from './useSkillCategories';

const SkillCategorySelect = ({
  skillCategoryId,
  onChange
}: {
  skillCategoryId?: number;
  onChange: (skillId: number) => void;
}) => {
  const { skillCategories, isPending } = useSkillCategories();

  return (
    <>
      <label htmlFor="skill_category" className="content-center">
        Category:
      </label>
      <div>
        <select
          id="skill_category"
          className="border-[0.5px] border-gray-500 h-8 w-full"
          value={skillCategoryId}
          onChange={(e) => onChange(parseInt(e.target.value))}
        >
          {isPending && (
            <option key={0} value={Number.NEGATIVE_INFINITY}>
              Loading...
            </option>
          )}
          {!isPending && (
            <option key={0} value={0}>
              Any
            </option>
          )}
          {skillCategories?.map((skillCategory, idx) => (
            <option key={idx} value={skillCategory.id}>
              {skillCategory.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default SkillCategorySelect;
