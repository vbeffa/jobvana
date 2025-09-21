import { useState } from 'react';
import { type Company } from '../Context';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import MyCompanyAddresses from './MyCompanyAddresses';
import MyCompanyMain from './MyCompanyMain';
import useCompanyAddresses from './useCompanyAddresses';

const MyCompany = ({ company }: { company: Company }) => {
  const [card, setCard] = useState<'main' | 'addresses'>('main');
  const { count } = useCompanyAddresses(company.id);

  const currComponent =
    card === 'main' ? (
      <MyCompanyMain company={company} />
    ) : (
      <MyCompanyAddresses companyId={company.id} />
    );

  return (
    <>
      <ResourcesContainer minWidth="min-w-[800px]">
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
