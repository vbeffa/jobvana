import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import EditDelete from '../EditDelete';
import TextInput from '../TextInput';
import type { CompanyAddress } from '../types';
import supabase from '../utils/supabase';
import StateSelect from './StateSelect';
import { isValid, isValidAddress } from './utils';

const MyCompanyAddress = ({
  address,
  idx,
  setError,
  onUpdate
}: {
  address: CompanyAddress;
  idx: number;
  setError: (err: Error | undefined) => void;
  onUpdate: (company: CompanyAddress) => void;
}) => {
  const [editAddress, setEditAddress] = useState<CompanyAddress>(address);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(
    () => !_.isEqual(address, editAddress),
    [address, editAddress]
  );

  const updateAddress = useCallback(async () => {
    console.log(editAddress);
    if (!isValidAddress(editAddress)) {
      console.log('invalid');
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { data, error } = await supabase
        .from('company_addresses')
        .update(editAddress)
        .eq('id', editAddress.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        console.log(data);
        // address = data?.[0];
        onUpdate(data?.[0]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editAddress, onUpdate, setError]);

  const deleteAddress = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    console.log(editAddress);
    try {
      const { error } = await supabase
        .from('company_addresses')
        .delete()
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
    <div className="bg-gray-100 p-2 border-[0.5px] border-gray-400 rounded-lg w-72 h-31">
      <div className="relative">
        <EditDelete
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={editMode && (!isValid || !isDirty || isSubmitting)}
          onEdit={() => setEditAddress(address)}
          onDelete={deleteAddress}
          onSave={updateAddress}
        />
      </div>
      {editMode && (
        <div className="flex flex-col gap-1">
          <div className="w-[204px]">
            <TextInput
              id={`street_${idx}`}
              value={editAddress.street}
              onChange={(street) =>
                setEditAddress((address) => ({
                  ...address,
                  street
                }))
              }
            />
          </div>
          <div className="flex flex-row gap-1">
            <div className="w-[204px]">
              <TextInput
                id={`city_${idx}`}
                value={editAddress.city}
                onChange={(city) =>
                  setEditAddress((address) => ({
                    ...address,
                    city
                  }))
                }
              />
            </div>
            <StateSelect
              state={editAddress.state}
              idx={idx}
              onChange={(state) =>
                setEditAddress((address) => ({
                  ...address,
                  state
                }))
              }
            />
          </div>
          <div className="w-[204px]">
            <TextInput
              id={`zip_${idx}`}
              value={editAddress.zip}
              onChange={(zip) =>
                setEditAddress((address) => ({
                  ...address,
                  zip
                }))
              }
            />
          </div>
        </div>
      )}
      {!editMode && (
        <div>
          <div className="h-[38px] pl-[4.5px] pt-[4.5px]">{address.street}</div>
          <div className="h-[38px] pl-[4.5px] pt-[3.5px]">
            <div className="flex flex-row">
              <div className="w-[216px]">{address.city}</div>
              <div>{address.state}</div>
            </div>
          </div>
          <div className="h-[38px] pl-[4.5px] pt-[2.5px]">{address.zip}</div>
        </div>
      )}
    </div>
  );
};

export default MyCompanyAddress;
