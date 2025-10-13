import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaArrowUpRightFromSquare, FaPhone } from 'react-icons/fa6';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import supabase from '../../db/supabase';
import type { CompanyAddress } from '../../types';
import { isValidAddress } from '../utils';
import MyCompanyAddressContainer from './MyCompanyAddressContainer';
import MyCompanyEditAddress from './MyCompanyEditAddress';

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
    <MyCompanyAddressContainer>
      <div className="relative">
        <EditDeleteIcons
          type="address"
          isEditing={isEditing}
          disabled={
            isEditing && (!isDirty || !isValidAddress(address) || isSubmitting)
          }
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
        {!isEditing && (
          <a
            target="_blank"
            href={`https://www.google.com/maps/place/${address.street} ${address.city} ${address.state} ${address.zip}`}
          >
            <FaArrowUpRightFromSquare className="absolute right-12 top-[9px]" />
          </a>
        )}
      </div>
      <>
        {!isEditing && (
          <div>
            <div>{editAddress.street}</div>
            <div>{editAddress.street_2}</div>
            <div>
              <div className="flex flex-row gap-1">
                <div>{editAddress.city}</div>
                <div>{editAddress.state}</div>
              </div>
              <div>{editAddress.zip}</div>
              <div className="flex flex-row gap-1">
                <div className="content-center">
                  <FaPhone />
                </div>
                {editAddress.phone}
              </div>
            </div>
          </div>
        )}
        {isEditing && (
          <MyCompanyEditAddress
            idx={idx}
            address={editAddress}
            setAddress={setEditAddress}
          />
        )}
      </>
    </MyCompanyAddressContainer>
  );
};

export default MyCompanyAddress;
