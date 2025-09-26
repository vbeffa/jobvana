import { useState } from 'react';
import { type Company } from '../../Context';
import SummaryCard from '../../SummaryCard';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import MyCompanyAddresses from './MyCompanyAddresses';
import MyCompanyOverview from './MyCompanyOverview';
import useCompanyAddresses from './useCompanyAddresses';

const MyCompany = ({ company }: { company: Company }) => {
  const [card, setCard] = useState<'main' | 'addresses'>('main');
  const { count } = useCompanyAddresses(company.id);

  const currComponent =
    card === 'main' ? (
      <MyCompanyOverview company={company} />
    ) : (
      <MyCompanyAddresses companyId={company.id} />
    );

  return (
    <>
      <h1>My Company</h1>
      <ResourcesContainer minWidth="w-[1100px]" hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'main'}
              onClick={() => setCard('main')}
              title="Main"
              text="Name, Industry, Size"
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'addresses'}
              onClick={() => setCard('addresses')}
              title="Addresses"
              text={`${count ?? 0} total`}
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>{currComponent}</ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyCompany;
