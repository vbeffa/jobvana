import _ from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import {
  ActionMenuContainer,
  RightSide
} from '../../containers/ActionMenuContainer';
import SaveCancelIcons from '../../controls/SaveCancelIcons';
import supabase from '../../db/supabase';
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
      type: 'office',
      location: null
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
    <MyCompanyAddressContainer isEditing={true}>
      <ActionMenuContainer justify="justify-end">
        <RightSide>
          <SaveCancelIcons
            disabled={!isValidAddress(newAddress) || !isDirty || isSubmitting}
            onCancel={onCancel}
            onSave={createAddress}
          />
        </RightSide>
      </ActionMenuContainer>
      <div className="p-4">
        <MyCompanyEditAddress
          idx="new"
          address={newAddress}
          setAddress={setNewAddress}
        />
      </div>
    </MyCompanyAddressContainer>
  );
};

export default MyCompanyNewAddress;
