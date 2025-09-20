import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import EditButtons from '../EditButtons';
import Error from '../Error';
import TextInput from '../TextInput';
import type { CompanyAddress } from '../types';
import supabase from '../utils/supabase';
import StateSelect from './StateSelect';
import { isValid, isValidAddress } from './utils';

export type MyCompanyAddressesProps = {
  addresses: Array<CompanyAddress>;
};

const MyCompanyAddresses = ({ addresses }: MyCompanyAddressesProps) => {
  const editIndex = 1;
  const [editAddress, setEditAddress] = useState<CompanyAddress>(
    addresses[editIndex]
  );
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const isDirty = useMemo(
    () => !_.isEqual(addresses[editIndex], editAddress),
    [addresses, editAddress, editIndex]
  );

  const updateAddress = useCallback(async () => {
    if (!isValidAddress(editAddress)) {
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase
        .from('company_addresses')
        .update(editAddress)
        .eq('id', editAddress.id);

      if (error) {
        console.log(error);
        setError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editAddress, setError]);

  return (
    <>
      {error && <Error error={error} />}
      <div className="mx-2 flex flex-row gap-x-2 relative">
        <EditButtons
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={editMode && (!isValid || !isDirty || isSubmitting)}
          onEdit={() => setEditAddress(addresses[0])}
          onSave={updateAddress}
        />
        <div className="bg-gray-100 p-4 rounded-lg">
          {editMode && (
            <div className="flex flex-col gap-2">
              <TextInput
                id="street"
                value={editAddress.street}
                onChange={console.log}
              />
              <div className="flex flex-row gap-2">
                <TextInput
                  id="city"
                  value={editAddress.city}
                  onChange={console.log}
                />
                <StateSelect state={editAddress.state} onChange={console.log} />
              </div>
              <TextInput
                id="zip"
                value={editAddress.zip}
                onChange={console.log}
              />
            </div>
          )}
          {!editMode &&
            addresses.map((address, idx) => (
              <div key={idx}>
                <div className="h-[32.5px] pl-[4.5px] pt-[4.5px]">
                  {address.street}
                </div>
                <div className="h-[32.5px] pl-[4.5px] pt-[4.5px]">
                  {address.city} {address.state}
                </div>
                <div className="h-[32.5px] pl-[4.5px] pt-[4.5px]">
                  {address.zip}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default MyCompanyAddresses;
