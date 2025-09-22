import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import SaveCancel from '../SaveCancel';
import TextInput from '../TextInput';
import type { CompanyAddress } from '../types';
import supabase from '../utils/supabase';
import StateSelect from './StateSelect';
import { isValidAddress } from './utils';

type ToInsert = Omit<CompanyAddress, 'id'>;

const MyCompanyNewAddress = ({
  companyId,
  setError,
  onCreate,
  onCancel
}: {
  companyId: number;
  setError: (err: Error | undefined) => void;
  onCreate: () => void;
  onCancel: () => void;
}) => {
  const emptyAddress: ToInsert = useMemo(
    () => ({
      company_id: companyId,
      street: '',
      city: '',
      state: '',
      zip: '',
      type: 'office'
    }),
    [companyId]
  );
  const [newAddress, setNewAddress] = useState<ToInsert>(emptyAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDirty = useMemo(
    () => !_.isEqual(emptyAddress, newAddress),
    [emptyAddress, newAddress]
  );

  const createAddress = useCallback(async () => {
    if (!isValidAddress(newAddress)) {
      return;
    }
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase
        .from('company_addresses')
        .insert(newAddress);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        onCreate();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [newAddress, onCreate, setError]);

  return (
    <div className="bg-gray-100 p-2 border-[0.5px] border-gray-400 rounded-lg w-72 h-33">
      <div className="relative">
        <SaveCancel
          disabled={
            newAddress &&
            (!isValidAddress(newAddress) || !isDirty || isSubmitting)
          }
          onCancel={onCancel}
          onSave={createAddress}
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="w-[204px]">
          <TextInput
            id={`street_new`}
            value={newAddress.street}
            placeholder="Street"
            onChange={(street) =>
              setNewAddress((address) => ({
                ...address,
                street
              }))
            }
          />
        </div>
        <div className="flex flex-row gap-1">
          <div className="w-[204px]">
            <TextInput
              id={`city_new`}
              value={newAddress.city}
              placeholder="City"
              onChange={(city) =>
                setNewAddress((address) => ({
                  ...address,
                  city
                }))
              }
            />
          </div>
          <StateSelect
            state={newAddress.state}
            idx={Number.MAX_VALUE}
            showEmpty={true}
            onChange={(state) =>
              setNewAddress((address) => ({
                ...address,
                state
              }))
            }
          />
        </div>
        <div className="w-[204px]">
          <TextInput
            id="zip_new"
            value={newAddress.zip}
            placeholder="Zip"
            onChange={(zip) =>
              setNewAddress((address) => ({
                ...address,
                zip
              }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyCompanyNewAddress;
