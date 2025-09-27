const LEVELS = [0, 1, 2, 3, 4];

const LevelSelect = ({
  id,
  value,
  onChange
}: {
  id: string;
  value: number;
  onChange: (roleId: number) => void;
}) => {
  return (
    <div className="flex flex-row gap-2">
      <label htmlFor={id} className="content-center">
        Level:
      </label>
      <select
        id={id}
        className="border-[0.5px] border-gray-500 h-8 w-10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        {LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelSelect;
