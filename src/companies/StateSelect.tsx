// prettier-ignore
const STATES = [
  'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM',
  'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 
  'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 
  'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 
  'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA',
  'WA', 'WV', 'WI', 'WY'
];

const StateSelect = ({
  state,
  idx,
  onChange,
  showEmpty
}: {
  state?: string;
  idx?: number;
  onChange: (stateId: string) => void;
  showEmpty?: boolean;
}) => {
  return (
    <select
      id={`state${idx ? `_${idx}` : ''}`}
      className="border-[0.5px] border-gray-500 h-[2.05rem] px-2 py-0.5"
      value={state}
      onChange={(e) => onChange(e.target.value)}
    >
      {showEmpty && <option key={0} value="" />}
      {STATES?.map((state, idx) => (
        <option key={idx} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
};

export default StateSelect;
