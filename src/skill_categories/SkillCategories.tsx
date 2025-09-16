import { useEffect, useState } from 'react';
import Button from '../Button';
import Error from '../Error';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import SkillCategoryDetails from './SkillCategoryDetails';
import SkillCategoryTree from './SkillCategoryTree';
import useSkillCategories from './useSkillCategories';

const SkillCategories = () => {
  const [view, setView] = useState<'list' | 'tree'>('list');
  const [open, setOpen] = useState(true);
  const { rootCategories, skillCategories, error } = useSkillCategories();
  const [skillCategoryId, setSkillCategoryId] = useState<number | null>(null);

  useEffect(() => {
    setSkillCategoryId(skillCategories?.[0].id ?? null);
  }, [skillCategories]);

  return (
    <div className="mx-4 relative">
      {error && <Error error={error} />}
      <h1>Skill Categories</h1>
      <div className="absolute right-[12.5%] text-right w-[75%] min-w-[1100px] top-8">
        <Button
          label={`${view === 'list' ? 'Switch to Tree View' : 'Switch to List View'}`}
          onClick={() => setView((view) => (view === 'list' ? 'tree' : 'list'))}
        />
      </div>
      <div className="h-4" />
      {view === 'list' && (
        <ResourcesContainer>
          <ResourceListContainer>
            <SummaryCardsContainer hasFilters={false}>
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
          <ResourceDetailsContainer hasFilters={false}>
            {skillCategoryId ? (
              <SkillCategoryDetails id={skillCategoryId} />
            ) : undefined}
          </ResourceDetailsContainer>
        </ResourcesContainer>
      )}
      {view === 'tree' && (
        <div className="w-[50%]">
          <div className="pl-12">
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
