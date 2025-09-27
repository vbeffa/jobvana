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
  const [isEditing, setIsEditing] = useState(false);
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
    <div className="bg-gray-100 p-2 border-[0.5px] border-gray-400 rounded-lg w-72 h-31">
      <div className="relative">
        <EditDeleteIcons
          type="address"
          isEditing={isEditing}
          disabled={isEditing && (!isDirty || !isValidCompany || isSubmitting)}
          onEdit={() => {
            setError(undefined);
            setEditAddress(address);
            setIsEditing(true);
          }}
          onCancel={() => {
            setEditAddress(address);
            setIsEditing(false);
          }}
          onDelete={deleteAddress}
          onSave={async () => {
            setIsEditing(false);
            await updateAddress();
          }}
          bgColor="--color-gray-100"
        />
      </div>
      {!isEditing && (
        <div>
          <div>{editAddress.street}</div>
          <div>
            <div className="flex flex-row gap-1">
              <div>{editAddress.city}</div>
              <div>{editAddress.state}</div>
            </div>
          </div>
          <div>{editAddress.zip}</div>
        </div>
      )}
      {isEditing && (
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
    </div>
  );
};

export default MyCompanyAddress;
