import useSkillsLite from '../skills/useSkillsLite';

const SkillSelect = ({
  id,
  skillId,
  onChange
}: {
  id: string;
  skillId?: number;
  onChange: (skillId: number) => void;
}) => {
  const { isPending, skills } = useSkillsLite();

  return (
    <select
      id={id}
      className="border border-gray-500 rounded-lg h-8 w-60 px-2 py-0.5"
      value={skillId}
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
