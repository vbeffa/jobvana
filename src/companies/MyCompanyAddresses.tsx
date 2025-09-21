import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Error from '../Error';
import MyCompanyAddress from './MyCompanyAddress';
import MyCompanyNewAddress from './MyCompanyNewAddress';
import useCompanyAddresses from './useCompanyAddresses';

export type MyCompanyAddressesProps = {
  companyId: number;
};

const MyCompanyAddresses = ({ companyId }: MyCompanyAddressesProps) => {
  const [error, setError] = useState<Error>();
  const [newAddress, setNewAddress] = useState(false);
  const { addresses, refetch } = useCompanyAddresses(companyId);

  if (!addresses) {
    return;
  }

  return (
    <>
      {error && <Error error={error} />}
      <div className="flex flex-col gap-y-4">
        {addresses.map((address, idx) => (
          <div key={idx}>
            <MyCompanyAddress
              address={address}
              idx={idx}
              setError={setError}
              onUpdate={refetch}
            />
          </div>
        ))}
        {!newAddress && (
          <div
            className="text-blue-400 cursor-pointer w-72 pt-4 pr-2 flex justify-end"
            onClick={() => setNewAddress(true)}
          >
            <FaPlus />
          </div>
        )}
        {newAddress && (
          <MyCompanyNewAddress
            companyId={companyId}
            setError={setError}
            onCreate={() => {
              setNewAddress(false);
              refetch();
            }}
            onCancel={() => setNewAddress(false)}
          />
        )}
      </div>
    </>
  );
};

export default MyCompanyAddresses;
