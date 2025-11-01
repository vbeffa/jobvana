import { useState } from 'react';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import SummaryCard from '../SummaryCard';
import Definitions from './Definitions';

const About = () => {
  const [card, setCard] = useState('about');

  return (
    <>
      <h1>Jobvana</h1>
      <ResourcesContainer bannerType="title">
        <ResourceListContainer>
          <SummaryCardsContainer bannerType="title" hasPageNav={false}>
            <SummaryCard
              key={1}
              selected={card === 'about'}
              onClick={() => setCard('about')}
              title="About"
              text="About Jobvana"
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'contact'}
              onClick={() => setCard('contact')}
              title="Contact"
              text="Contact Us"
              borderBottom={true}
            />
            <SummaryCard
              key={3}
              selected={card === 'definitions'}
              onClick={() => setCard('definitions')}
              title="Definitions"
              text="Jobs, roles, skills, applications, interviews"
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer padding="">
          <>
            {card === 'about' && <div className="p-4">About</div>}
            {card === 'contact' && <div className="p-4">Contact Us</div>}
            {card === 'definitions' && <Definitions />}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default About;
