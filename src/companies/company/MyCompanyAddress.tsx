import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import TextInput from '../../inputs/TextInput';
import type { CompanyAddress } from '../../types';
import supabase from '../../utils/supabase';
import StateSelect from '../StateSelect';
import { isValidAddress, isValidCompany } from '../utils';

const MyCompanyAddress = ({
  address,
  idx,
  setError,
  onUpdate
}: {
  address: CompanyAddress;
  idx: number;
  setError: (err: Error | undefined) => void;
  onUpdate: () => void;
}) => {
  const [editAddress, setEditAddress] = useState<CompanyAddress>(address);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditAddress(address);
  }, [address]);

  const isDirty = useMemo(
    () => !_.isEqual(address, editAddress),
    [address, editAddress]
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
        .eq('id', editAddress.id)
        .select();

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editAddress, onUpdate, setError]);

  const deleteAddress = useCallback(async () => {
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase
        .from('company_addresses')
        .delete()
        .eq('id', editAddress.id);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onUpdate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editAddress, onUpdate, setError]);

  return (
    <div className="bg-gray-100 p-2 border-[0.5px] border-gray-400 rounded-lg w-72 h-33">
      <div className="relative">
        <EditDeleteIcons
          type="address"
          editMode={editMode}
          setEditMode={setEditMode}
          disabled={editMode && (!isValidCompany || !isDirty || isSubmitting)}
          onEdit={() => setEditAddress(address)}
          onDelete={deleteAddress}
          onSave={updateAddress}
        />
      </div>
      {editMode && (
        <div className="flex flex-col gap-2">
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
          <div className="h-[40px] pl-[4.5px] pt-[7.5px]">
            <div className="flex flex-row">
              <div className="w-[216px]">{address.city}</div>
              <div>{address.state}</div>
            </div>
          </div>
          <div className="h-[38px] pl-[4.5px] pt-[8.5px]">{address.zip}</div>
        </div>
      )}
    </div>
  );
};

export default MyCompanyAddress;
