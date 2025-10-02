import { useState } from 'react';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import SummaryCard from '../SummaryCard';
import ChangePassword from './ChangePassword';

const Account = () => {
  const [card, setCard] = useState('account');

  return (
    <div className="mx-4">
      <h1>Account Details</h1>
      <ResourcesContainer hasFilters={false}>
        <ResourceListContainer>
          <SummaryCardsContainer>
            <SummaryCard
              key={1}
              selected={card === 'account'}
              onClick={() => setCard('account')}
              title="Security"
              text="Change your password"
              borderBottom={true}
            />
            <SummaryCard
              key={2}
              selected={card === 'profile'}
              onClick={() => setCard('profile')}
              title="Profile"
              text="Update your name"
              borderBottom={true}
            />
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {card === 'account' && <ChangePassword />}
            {card === 'profile' && <>Profile</>}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Account;
