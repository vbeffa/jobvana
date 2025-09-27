import Select from '../inputs/Select';
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
        <Select
          id="skill_category"
          value={skillCategoryId}
          width="w-full"
          onChange={(e) => onChange(parseInt(e.target.value))}
        >
          <>
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
          </>
        </Select>
      </div>
    </>
  );
};

export default SkillCategorySelect;
