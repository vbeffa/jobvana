import _ from 'lodash';
import { useCallback, useState } from 'react';
import Button from '../Button';
import Error from '../Error';
import JobsList from '../jobs/JobsList';
import LoadingModal from '../LoadingModal';
import PillContainer from '../PillContainer';
import Section from '../Section';
import UpdatingModal from '../UpdatingModal';
import IndustrySelect from './IndustrySelect';
import SizeInput from './SizeInput';
import useCompany, { type FullCompany } from './useCompany';
import { findHeadquarters, isHeadquarters } from './utils';

const CompanyDetails = ({ id }: { id: number }) => {
  const [editMode, setEditMode] = useState(false);
  const { company, update, error, isPlaceholderData, isPending } =
    useCompany(id);
  const [editCompany, setEditCompany] = useState<FullCompany>();

  const updateCompany = useCallback(() => {
    if (!editCompany) {
      return;
    }
    update.mutate(editCompany);
  }, [editCompany, update]);

  if (error) {
    return <Error error={error} />;
  }

  if (isPending) {
    return <LoadingModal />;
  }

  if (!company) {
    return null;
  }

  const hq = findHeadquarters(company);

  return (
    <>
      {isPlaceholderData && <LoadingModal />}
      {update.isPending && <UpdatingModal />}
      <Section title={company.name}>
        <div className="absolute right-0 top-0 flex flex-row gap-2">
          {editMode && (
            <Button label="Cancel" onClick={() => setEditMode(false)} />
          )}
          <Button
            label={`${editMode ? 'Save' : 'Edit'}`}
            onClick={() =>
              setEditMode((editMode) => {
                if (!editMode) {
                  setEditCompany(_.cloneDeep(company));
                } else {
                  updateCompany();
                }
                return !editMode;
              })
            }
          />
        </div>
        <div className="flex flex-row gap-1">
          {!editMode && (
            <div className="pt-1 flex flex-row gap-1">
              <PillContainer>{company.industry.name}</PillContainer>
              <div className="content-center">
                {company.num_employees} employees
              </div>
            </div>
          )}
          {editMode && editCompany && (
            <div className="pt-2 h-[38px] flex flex-row gap-2">
              <IndustrySelect
                id="edit_industry"
                industryId={editCompany.industry.id}
                showAll={false}
                onChange={(industryId) => {
                  if (industryId) {
                    setEditCompany((company) =>
                      company
                        ? {
                            ...company,
                            industry: {
                              id: industryId,
                              name: company.industry.name
                            }
                          }
                        : undefined
                    );
                  }
                }}
              />
              <div className="content-center">Size:</div>
              <SizeInput
                id="size"
                size={editCompany.num_employees}
                onChange={(size: number) => {
                  setEditCompany((company) =>
                    company
                      ? {
                          ...company,
                          num_employees: size
                        }
                      : undefined
                  );
                }}
              />
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
          {!editMode && <div className="h-[87px]">{company.description}</div>}
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
        {company.addresses.length > 0 ? (
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
        <JobsList jobs={company.jobs} />
      </Section>
    </>
  );
};

export default CompanyDetails;
