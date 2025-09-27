import useSkillsLite from '../../skills/useSkillsLite';

const SkillSelect = ({
  id,
  skillId,
  showAny = true,
  showEmpty = false,
  onChange
}: {
  id: string;
  skillId?: number;
  showAny?: boolean;
  showEmpty?: boolean;
  onChange: (skillId: number) => void;
}) => {
  if (showAny && showEmpty) {
    throw new Error('cannot set both showAny and showEmpty');
  }
  const { isPending, skills } = useSkillsLite();

  return (
    <select
      id={id}
      className="border-[0.5px] border-gray-500 h-8 py-0.5"
      value={skillId}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
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
    </select>
  );
};

export default SkillSelect;
