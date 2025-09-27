import Select from '../../inputs/Select';

const LEVELS = [0, 1, 2, 3, 4];

const LevelSelect = ({
  id,
  value,
  onChange
}: {
  id: string;
  value: number;
  onChange: (level: number) => void;
}) => {
  return (
    <div className="flex flex-row gap-2">
      <label htmlFor={id} className="content-center">
        Level:
      </label>
      <Select
        id={id}
        value={value}
        width="w-10"
        onChange={(e) => onChange(parseInt(e.target.value))}
      >
        {LEVELS.map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default LevelSelect;
