import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import SaveCancelIcons from '../../controls/SaveCancelIcons';
import supabase from '../../utils/supabase';
import { isValidAddress } from '../utils';
import MyCompanyAddressContainer from './MyCompanyAddressContainer';
import MyCompanyEditAddress, { type ToInsert } from './MyCompanyEditAddress';

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
      street_2: null,
      city: '',
      state: '',
      zip: '',
      phone: null,
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
        .insert(newAddress as ToInsert);

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
    <MyCompanyAddressContainer>
      <div className="relative">
        <SaveCancelIcons
          disabled={!isValidAddress(newAddress) || !isDirty || isSubmitting}
          onCancel={onCancel}
          onSave={createAddress}
        />
      </div>
      <MyCompanyEditAddress
        idx="new"
        address={newAddress}
        setAddress={setNewAddress}
      />
    </MyCompanyAddressContainer>
  );
};

export default MyCompanyNewAddress;
