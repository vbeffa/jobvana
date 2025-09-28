import { useState } from 'react';
import { FaAddressBook, FaBuilding, FaChessKnight } from 'react-icons/fa6';
import { type Company } from '../../Context';
import SummaryCard from '../../SummaryCard';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import MyCompanyAddresses from './MyCompanyAddresses';
import MyCompanyInterviewProcess from './MyCompanyInterviewProcess';
import MyCompanyOverview from './MyCompanyOverview';
import useCompanyAddresses from './useCompanyAddresses';

const MyCompany = ({ company }: { company: Company }) => {
  const [card, setCard] = useState<
    'overview' | 'addresses' | 'interview_process'
  >('overview');
  const { count } = useCompanyAddresses(company.id);

  const currComponent = (() => {
    switch (card) {
      case 'overview':
        return <MyCompanyOverview company={company} />;
      case 'addresses':
        return <MyCompanyAddresses companyId={company.id} />;
      case 'interview_process':
        return <MyCompanyInterviewProcess company={company} />;
    }
  })();

  return (
    <>
      <h1>My Company</h1>
      <ResourcesContainer minWidth="w-[1100px]" hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'overview'}
              onClick={() => setCard('overview')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaBuilding />
                  </div>
                  Overview
                </div>
              }
              text="Name, Industry, Size, Contact"
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'addresses'}
              onClick={() => setCard('addresses')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaAddressBook />
                  </div>
                  Locations
                </div>
              }
              text={`${count !== undefined ? `${count} total` : 'Loading...'}`}
              borderBottom={true}
            />
            <SummaryCard
              key={3}
              selected={card === 'interview_process'}
              onClick={() => setCard('interview_process')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaChessKnight />
                  </div>
                  Interview Process
                </div>
              }
              text="Define your process"
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
