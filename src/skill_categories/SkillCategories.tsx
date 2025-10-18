import { useEffect, useState } from 'react';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import Button from '../controls/Button';
import JobvanaError from '../JobvanaError';
import SummaryCard from '../SummaryCard';
import SkillCategoryDetails from './SkillCategoryDetails';
import SkillCategoryTree from './SkillCategoryTree';
import useSkillCategories from './useSkillCategories';

const SkillCategories = () => {
  const [view, setView] = useState<'list' | 'tree'>('list');
  const [open, setOpen] = useState(true);
  const { rootCategories, skillCategories, error } = useSkillCategories();
  const [skillCategoryId, setSkillCategoryId] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkillCategoryId(skillCategories?.[0].id ?? null);
  }, [skillCategories]);

  return (
    <div className="mx-4 relative">
      {error && <JobvanaError error={error} />}
      <h1>Skill Categories</h1>
      <div className="absolute top-8 right-0.5 text-right w-full min-w-[1100px]">
        <Button
          label={`${view === 'list' ? 'Switch to Tree View' : 'Switch to List View'}`}
          onClick={() => setView((view) => (view === 'list' ? 'tree' : 'list'))}
        />
      </div>
      {view === 'list' && (
        <ResourcesContainer bannerType="title">
          <ResourceListContainer>
            <SummaryCardsContainer>
              {skillCategories?.map((skillCategory, idx) => {
                return (
                  <SummaryCard
                    key={skillCategory.id}
                    selected={skillCategoryId === skillCategory.id}
                    onClick={() => setSkillCategoryId(skillCategory.id)}
                    title={skillCategory.name}
                    text={
                      <>
                        <div>{skillCategory.name}</div>
                      </>
                    }
                    borderBottom={idx < skillCategories.length - 1}
                  />
                );
              })}
            </SummaryCardsContainer>
          </ResourceListContainer>
          <ResourceDetailsContainer>
            {skillCategoryId ? (
              <SkillCategoryDetails id={skillCategoryId} />
            ) : undefined}
          </ResourceDetailsContainer>
        </ResourcesContainer>
      )}
      {view === 'tree' && (
        <div className="w-[50%]">
          <div className="pl-13">
            <Button
              label={`${open ? 'Collapse Tree' : 'Expand Tree'}`}
              onClick={() => setOpen((open) => !open)}
            />
          </div>
          {rootCategories && (
            <SkillCategoryTree skillCategories={rootCategories} open={open} />
          )}
        </div>
      )}
    </div>
  );
};

export default SkillCategories;
