import Select from '../../inputs/Select';
import useSkillsLite from '../../skills/useSkillsLite';

const SkillSelect = ({
  id,
  skillIds,
  showAny = true,
  showEmpty = false,
  onChange
}: {
  id: string;
  skillIds?: Array<number>;
  showAny?: boolean;
  showEmpty?: boolean;
  onChange: (skillId: number) => void;
}) => {
  if (showAny && showEmpty) {
    throw new Error('cannot set both showAny and showEmpty');
  }
  const { isPending, skills } = useSkillsLite();

  return (
    <Select
      id={id}
      value={skillIds?.[0]}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      <>
        {isPending && (
          <option key={0} value={Number.NEGATIVE_INFINITY}>
            Loading...
          </option>
        )}
        {!isPending && showAny && (
          <option key={0} value={0}>
            Any
          </option>
        )}
        {showEmpty && <option key={0} value="" />}
        {skills?.map((skill, idx) => (
          <option key={idx} value={skill.id}>
            {skill.name}
            {skill.abbreviation && ` (${skill.abbreviation})`}
          </option>
        ))}
      </>
    </Select>
  );
};

export default SkillSelect;
