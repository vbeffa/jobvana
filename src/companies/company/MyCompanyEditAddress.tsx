import TextInput from '../../inputs/TextInput';
import type { CompanyAddress } from '../../types';
import StateSelect from '../StateSelect';

export type ToInsert = Omit<CompanyAddress, 'id'>;

const MyCompanyEditAddress = <T extends ToInsert | CompanyAddress>({
  idx,
  address,
  setAddress
}: {
  idx: number | 'new';
  address: T;
  setAddress: React.Dispatch<React.SetStateAction<T>>;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full">
        <TextInput
          id={`street_${idx}`}
          value={address.street}
          maxLength={100}
          placeholder="Street"
          onChange={(street) =>
            setAddress((address) => ({
              ...address,
              street
            }))
          }
        />
      </div>
      <div className="w-full">
        <TextInput
          id={`street_2_${idx}`}
          value={address.street_2 ?? ''}
          maxLength={100}
          placeholder="Street 2"
          onChange={(street_2) =>
            setAddress((address) => ({
              ...address,
              street_2
            }))
          }
        />
      </div>
      <div className="w-full flex flex-row gap-1">
        <div className="w-full">
          <TextInput
            id={`city_${idx}`}
            value={address.city}
            maxLength={50}
            placeholder="City"
            onChange={(city) =>
              setAddress((address) => ({
                ...address,
                city
              }))
            }
          />
        </div>
        <div>
          <StateSelect
            state={address.state}
            idx={Number.MAX_VALUE}
            showEmpty={true}
            onChange={(state) =>
              setAddress((address) => ({
                ...address,
                state
              }))
            }
          />
        </div>
      </div>
      <div className="w-[75%]">
        <TextInput
          id="zip_${idx}"
          value={address.zip}
          maxLength={15}
          placeholder="Zip"
          onChange={(zip) =>
            setAddress((address) => ({
              ...address,
              zip
            }))
          }
        />
      </div>
      <div className="w-[75%]">
        <TextInput
          id="phone_${idx}"
          value={address.phone ?? ''}
          maxLength={15}
          placeholder="Phone"
          onChange={(phone) =>
            setAddress((address) => ({
              ...address,
              phone
            }))
          }
        />
      </div>
    </div>
  );
};

export default MyCompanyEditAddress;
