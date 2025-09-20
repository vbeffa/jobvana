import { useState } from 'react';
import { type Company } from '../Context';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import ShowEditCompanyMain from './ShowEditCompanyMain';

const ShowEditCompany = ({ company }: { company: Company }) => {
  const [card, setCard] = useState('main');

  const currComponent =
    card === 'main' ? <ShowEditCompanyMain company={company} /> : undefined;

  return (
    <>
      <ResourcesContainer>
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'main'}
              onClick={() => setCard('main')}
              title={'Main'}
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'addresses'}
              onClick={() => setCard('addresses')}
              title={'Addresses'}
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>{currComponent}</ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default ShowEditCompany;
