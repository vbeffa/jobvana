import { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import ActionMenuContainer from '../../containers/ActionMenuContainer';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import MyCompanyAddress from './MyCompanyAddress';
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
    <div>
      <ActionMenuContainer justify="justify-end">
        {!newAddress ? (
          <div className="text-blue-400 pt-1.5 flex justify-start">
            <FaPlus
              className="cursor-pointer"
              onClick={() => setNewAddress(true)}
            />
          </div>
        ) : undefined}
      </ActionMenuContainer>
      {error && <JobvanaError error={error} />}
      {updating && <Modal type="updating" />}
      <div className="px-4 pt-4 grid grid-flow-col w-fit grid-rows-2 gap-4 mb-4">
        {addresses.map((address, idx) => (
          <div key={idx}>
            <MyCompanyAddress
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
    </div>
  );
};

export default MyCompanyAddresses;
