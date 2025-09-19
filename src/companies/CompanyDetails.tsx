import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Button from '../Button';
import { JobvanaContext } from '../Context';
import Error from '../Error';
import JobsList from '../jobs/JobsList';
import LoadingModal from '../LoadingModal';
import PillContainer from '../PillContainer';
import { Route } from '../routes/jobvana.companies.$id';
import Section from '../Section';
import TextInput from '../TextInput';
import type { Company } from '../types';
import UpdatingModal from '../UpdatingModal';
import CompanySize from './CompanySize';
import IndustrySelect from './IndustrySelect';
import useCompany from './useCompany';
import { companyFields, findHeadquarters, isHeadquarters } from './utils';

const CompanyDetails = ({ id, userId }: { id?: number; userId?: string }) => {
  const navigate = Route.useNavigate();
  const { setCompany } = useContext(JobvanaContext);
  const [editMode, setEditMode] = useState(false);
  const { company, update, error, isPlaceholderData, isPending, refetch } =
    useCompany(id);
  const [editCompany, setEditCompany] = useState<Partial<Company> | null>();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateCompany = useCallback(async () => {
    if (!editCompany) {
      return;
    }
    setIsUpdating(true);
    try {
      const data = await update.mutateAsync(editCompany);
      await refetch();
      navigate({
        to: '/jobvana/companies/$id',
        params: { id: data?.data?.[0].id?.toString() }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsUpdating(false);
    }
  }, [editCompany, navigate, refetch, update]);

  useEffect(() => {
    setEditMode(company === null);
  }, [company]);

  useEffect(() => {
    if (company) {
      setCompany(companyFields(company));
    }
  }, [company, setCompany]);

  useEffect(() => {
    if (company === null) {
      setEditCompany({
        user_id: userId
      });
    }
  }, [company, userId]);

  const isValid = useMemo(() => {
    return Boolean(
      editCompany &&
        editCompany.name &&
        editCompany.description &&
        editCompany.num_employees &&
        editCompany.industry_id &&
        editCompany.user_id
    );
  }, [editCompany]);

  const isDirty = useMemo(() => {
    if (!company) {
      return true; // onboarding
    }
    return Boolean(
      editCompany &&
        company &&
        (editCompany.name !== company.name ||
          editCompany.description !== company.description ||
          editCompany.num_employees !== company.num_employees ||
          editCompany.industry_id !== company.industry.id)
    );
  }, [editCompany, company]);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  // if (!company) {
  //   return null;
  // }

  const hq = company ? findHeadquarters(company) : undefined;

  return (
    <>
      {update.isPending && <UpdatingModal />}
      {isPlaceholderData && <LoadingModal />}
      <Section title={company?.name ?? 'New Company'}>
        <div className="absolute right-0 top-0 flex flex-row gap-2">
          {editMode && company && (
            <Button label="Cancel" onClick={() => setEditMode(false)} />
          )}
          <Button
            label={`${editMode ? 'Save' : 'Edit'}`}
            disabled={editMode && (!isValid || !isDirty || isUpdating)}
            onClick={() =>
              setEditMode((editMode) => {
                if (editMode) {
                  updateCompany();
                } else {
                  setEditCompany(company ? companyFields(company) : {});
                }
                return !editMode;
              })
            }
          />
        </div>
        <div className="flex flex-row gap-1">
          {!editMode && company && (
            <div className="pt-1 flex flex-row gap-1">
              <PillContainer>{company.industry.name}</PillContainer>
              <div className="content-center">
                {company.num_employees} employees
              </div>
            </div>
          )}
          {editMode && editCompany && (
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex flex-row gap-2">
                <TextInput
                  id="name"
                  label="Name"
                  value={editCompany.name ?? ''}
                  autoComplete="organization"
                  onChange={(name) => {
                    setEditCompany((company) =>
                      company ? { ...company, name } : undefined
                    );
                  }}
                />{' '}
              </div>
              <div className="flex flex-row gap-2">
                <IndustrySelect
                  industryId={editCompany.industry_id}
                  showAll={false}
                  showEmpty={company === null}
                  handleUpdate={setEditCompany}
                />
              </div>
              <div className="flex flex-row gap-2">
                <CompanySize
                  size={editCompany.num_employees}
                  handleUpdate={setEditCompany}
                />
              </div>
            </div>
          )}
        </div>
        {hq && (
          <div className="pt-1">
            {hq.city}, {hq.state}
          </div>
        )}
      </Section>
      <Section title="Description">
        <div>
          {!editMode && company && (
            <div className="h-[87px]">{company.description}</div>
          )}
          {editMode && editCompany && (
            <textarea
              id="description"
              className="p-1 border-[0.5px]"
              value={editCompany.description ?? ''}
              onChange={(e) => {
                setEditCompany((company) =>
                  company
                    ? {
                        ...company,
                        description: e.target.value
                      }
                    : undefined
                );
              }}
              rows={3}
              cols={80}
            />
          )}
        </div>
      </Section>
      <Section title="Offices">
        {company && company.addresses.length > 0 ? (
          <ul>
            {company.addresses.map((address) => (
              <li key={address.id}>
                {address.street} {address.city}, {address.state} {address.zip}
                {isHeadquarters(address) && ' (HQ)'}
              </li>
            ))}
          </ul>
        ) : null}
      </Section>
      <Section title="Current Jobs" isLast={true}>
        {(company && <JobsList jobs={company.jobs} />) ?? ''}
      </Section>
    </>
  );
};

export default CompanyDetails;
