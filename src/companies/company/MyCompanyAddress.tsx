import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaArrowUpRightFromSquare,
  FaLocationDot,
  FaPhone
} from 'react-icons/fa6';
import {
  ActionMenuContainer,
  LeftSide,
  RightSide
} from '../../containers/ActionMenuContainer';
import EditDeleteIcons from '../../controls/EditDeleteIcons';
import supabase from '../../db/supabase';
import Modal from '../../Modal';
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
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setEditAddress(address);
  }, [address]);

  const isDirty = useMemo(
    () => !_.isEqual(address, editAddress),
    [address, editAddress]
  );

  const validateAddress = useCallback(async () => {
    const url = new URL(
      'https://forward-reverse-geocoding.p.rapidapi.com/v1/forward'
    );
    url.searchParams.append('format', 'json');
    url.searchParams.append('street', editAddress.street);
    url.searchParams.append('city', editAddress.city);
    url.searchParams.append('state', editAddress.state);
    url.searchParams.append('postalcode', editAddress.zip);
    url.searchParams.append('country', 'USA');
    url.searchParams.append('addressdetails', '1');
    url.searchParams.append('accept-language', 'en');
    url.searchParams.append('namedetails', '0');
    url.searchParams.append('limit', '1');
    url.searchParams.append('bounded', '0');
    url.searchParams.append('polygon_text', '0');
    url.searchParams.append('polygon_kml', '0');
    url.searchParams.append('polygon_svg', '0');
    url.searchParams.append('polygon_geojson', '0');
    url.searchParams.append('polygon_threshold', '0.0');

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '1965928fb7msh924dfaa0130dcd4p1537b5jsn88568eeda361',
        'x-rapidapi-host': 'forward-reverse-geocoding.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      // console.log(response);
      const result = await response.json();
      // console.log('result:', result);
      return {
        lat: result?.[0]?.lat,
        long: result?.[0]?.lon
      };
    } catch (error) {
      console.log(error);
      setError(error as Error);
      return { lat: undefined, long: undefined };
    }
  }, [
    editAddress.city,
    editAddress.state,
    editAddress.street,
    editAddress.zip,
    setError
  ]);

  const updateAddress = useCallback(async () => {
    if (!isValidAddress(editAddress)) {
      return;
    }
    setIsValidating(true);
    const { lat, long } = await validateAddress();
    setIsValidating(false);
    if (!lat || !long) {
      if (
        !confirm(
          'Address could not be validated. If it is used in jobs, they may not be properly searchable. Save anyway?'
        )
      ) {
        return;
      }
    }
    editAddress.location = `POINT(${long} ${lat})`;
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
  }, [editAddress, onUpdate, setError, validateAddress]);

  const setHeadquarters = useCallback(async () => {
    console.log('-');
    setIsSubmitting(true);
    setError(undefined);
    try {
      const { error } = await supabase
        .from('company_addresses')
        .update({ type: 'office' })
        .filter('company_id', 'eq', address.company_id);
      if (error) {
        console.log(error);
        setError(error);
        return;
      }

      const { error: error2 } = await supabase
        .from('company_addresses')
        .update({ type: 'headquarters' })
        .eq('id', address.id);
      if (error2) {
        console.log(error2);
        setError(error2);
        return;
      }

      onUpdate();
    } finally {
      setIsSubmitting(false);
    }
  }, [address.company_id, address.id, onUpdate, setError]);

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
      <ActionMenuContainer>
        <LeftSide>
          {address.type === 'headquarters' && (
            <>
              <FaLocationDot />
              Headquarters
            </>
          )}
        </LeftSide>
        <RightSide>
          {!isEditing && (
            <>
              {address.type !== 'headquarters' && (
                <FaLocationDot
                  className="hover:text-blue-400 cursor-pointer"
                  onClick={setHeadquarters}
                />
              )}
              <a
                target="_blank"
                href={`https://www.google.com/maps/place/${address.street} ${address.city} ${address.state} ${address.zip}`}
              >
                <FaArrowUpRightFromSquare className="top-[9px]" />
              </a>
            </>
          )}
          <EditDeleteIcons
            type="address"
            isEditing={isEditing}
            disabled={
              isEditing &&
              (!isDirty || !isValidAddress(address) || isSubmitting)
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
          />
        </RightSide>
      </ActionMenuContainer>
      <div className="p-4">
        {isValidating && <Modal type="validating" />}
        {isSubmitting && <Modal type="saving" />}
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
      </div>
    </MyCompanyAddressContainer>
  );
};

export default MyCompanyAddress;
