import Select from '../../inputs/Select';
import type { CompanyAddress } from '../../types';

const LocationSelect = ({
  addressId,
  addresses,
  onChange
}: {
  addressId?: number;
  addresses: Array<CompanyAddress>;
  onChange: (addressId: number) => void;
}) => {
  return (
    <div>
      <Select
        id="location"
        value={addressId}
        width="w-fit"
        onChange={(e) => {
          onChange(parseInt(e.target.value));
        }}
      >
        <>
          <option key={-1} value={-1}>
            Remote
          </option>
          {addresses.map((address, idx) => (
            <option key={idx} value={address.id}>
              {`${address.street}, ${address.city} ${address.state} ${address.zip}`}
            </option>
          ))}
        </>
      </Select>
    </div>
  );
};

export default LocationSelect;
