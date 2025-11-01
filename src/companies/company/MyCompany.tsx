import { useContext, useMemo } from 'react';
import { FaBuilding, FaChessKnight, FaLocationArrow } from 'react-icons/fa6';
import { CompanyContext, type Company } from '../../Context';
import SummaryCard from '../../SummaryCard';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import MyCompanyAddresses from './MyCompanyAddresses';
import MyCompanyInterviewProcess from './MyCompanyInterviewProcess';
import MyCompanyOverview from './MyCompanyOverview';
import useCompanyAddresses from './useCompanyAddresses';
import { EMPTY_PROCESS, type InterviewProcess } from './utils';

const MyCompany = ({ company }: { company: Company }) => {
  const { myCompanyNav, setMyCompanyNav } = useContext(CompanyContext);
  const { count } = useCompanyAddresses(company.id);

  const currComponent = useMemo(() => {
    switch (myCompanyNav) {
      case 'overview':
        return <MyCompanyOverview company={company} />;
      case 'locations':
        return <MyCompanyAddresses companyId={company.id} />;
      case 'interview_process':
        return <MyCompanyInterviewProcess company={company} />;
    }
  }, [company, myCompanyNav]);

  const numRounds = useMemo(
    () =>
      ((company.interview_process ?? EMPTY_PROCESS) as InterviewProcess).rounds
        .length,
    [company.interview_process]
  );

  const pipelineSize = useMemo(
    () =>
      ((company.interview_process ?? EMPTY_PROCESS) as InterviewProcess)
        .pipeline_size,
    [company.interview_process]
  );

  return (
    <>
      <h1>My Company</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer bannerType="title" hasPageNav={false}>
            <SummaryCard
              key={1}
              selected={myCompanyNav === 'overview'}
              onClick={() => setMyCompanyNav('overview')}
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
              selected={myCompanyNav === 'locations'}
              onClick={() => setMyCompanyNav('locations')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaLocationArrow />
                  </div>
                  Locations
                </div>
              }
              text={`${count !== undefined ? `${count} address${count !== 1 ? 'es' : ''}` : 'Loading...'}`}
              borderBottom={true}
            />
            <SummaryCard
              key={3}
              selected={myCompanyNav === 'interview_process'}
              onClick={() => setMyCompanyNav('interview_process')}
              title={
                <div className="flex flex-row gap-1">
                  <div className="content-center">
                    <FaChessKnight />
                  </div>
                  <span className="truncate">Interview Process</span>
                </div>
              }
              text={`${numRounds} round${numRounds !== 1 ? 's' : ''}, ${pipelineSize} job seeker${pipelineSize > 1 ? 's' : ''}`}
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          {currComponent}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default MyCompany;
