import { useCallback, useMemo, useState } from 'react';
import {
  ActionMenuContainer,
  RightSide
} from '../../containers/ActionMenuContainer';
import SaveCancelIcons from '../../controls/SaveCancelIcons';
import supabase from '../../db/supabase';
import Modal from '../../Modal';
import { isValidAddress } from '../utils';
import MyCompanyAddressContainer from './MyCompanyAddressContainer';
import MyCompanyEditAddress, { type ToInsert } from './MyCompanyEditAddress';
import { validateAddress } from './utils';

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
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createAddress = useCallback(async () => {
    if (!isValidAddress(newAddress)) {
      return;
    }
    setIsValidating(true);
    const { lat, long } = await validateAddress(newAddress);
    setIsValidating(false);
    if (!lat || !long) {
      if (
        !confirm(
          'Address could not be validated. If it is used in jobs, they may not be properly searchable. Save anyway?'
        )
      ) {
        return;
      }
    } else {
      newAddress.location = `POINT(${long} ${lat})`;
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
            disabled={!isValidAddress(newAddress) || isSubmitting}
            onCancel={onCancel}
            onSave={createAddress}
          />
        </RightSide>
      </ActionMenuContainer>
      <div className="p-4">
        {isValidating && <Modal type="validating" />}
        {isSubmitting && <Modal type="saving" />}
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
