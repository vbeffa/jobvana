import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Error from '../../Error';
import UpdatingModal from '../../UpdatingModal';
import CompanyAddress from './MyCompanyAddress';
import MyCompanyNewAddress from './MyCompanyNewAddress';
import useCompanyAddresses from './useCompanyAddresses';

export type MyCompanyAddressesProps = {
  companyId: number;
};

const MyCompanyAddresses = ({ companyId }: MyCompanyAddressesProps) => {
  const [error, setError] = useState<Error>();
  const [newAddress, setNewAddress] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { addresses, refetch } = useCompanyAddresses(companyId);

  if (!addresses) {
    return;
  }

  return (
    <>
      {error && <Error error={error} />}
      {updating && <UpdatingModal />}
      <div className="grid grid-flow-col w-fit grid-rows-4 gap-2 mb-4">
        {addresses.map((address, idx) => (
          <div key={idx}>
            <CompanyAddress
              address={address}
              idx={idx}
              setError={setError}
              onUpdate={async () => {
                setUpdating(true);
                await refetch();
                setUpdating(false);
              }}
            />
          </div>
        ))}
        {!newAddress && (
          <div className="text-blue-400 w-72 pt-4 pr-2 flex justify-end">
            <FaPlus
              className="cursor-pointer"
              onClick={() => setNewAddress(true)}
            />
          </div>
        )}
        {newAddress && (
          <MyCompanyNewAddress
            companyId={companyId}
            setError={setError}
            onCreate={async () => {
              setNewAddress(false);
              setUpdating(true);
              await refetch();
              setUpdating(false);
            }}
            onCancel={() => setNewAddress(false)}
          />
        )}
      </div>
    </>
  );
};

export default MyCompanyAddresses;
