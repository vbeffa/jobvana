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
  onChange,
  showEmpty
}: {
  state?: string;
  onChange: (stateId: number) => void;
  showEmpty?: boolean;
}) => {
  return (
    <select
      id="state"
      className="border-[0.5px] border-gray-500 h-8 px-2 py-0.5"
      value={state}
      onChange={(e) => onChange(parseInt(e.target.value))}
    >
      {showEmpty && <option key={0} value={-1} />}
      {STATES?.map((state, idx) => (
        <option key={idx} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
};

export default StateSelect;
