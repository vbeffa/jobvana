import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import useSkills, { type SkillsParams } from '../hooks/useSkills';
import PageNav from '../PageNav';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SkillDetails from '../skills/SkillDetails';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';

const Skills = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [skillId, setSkillId] = useState<number | null>(null);

  const paging: SkillsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { skills, error, isPending, isPlaceholderData, skillsCount } =
    useSkills({ paging });

  useEffect(() => {
    if (skills?.[0]) {
      setSkillId(skills[0].id);
    }
  }, [skills]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <h1>Skills</h1>
      <div className="h-4" />
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
            pageSize={10}
            total={skillsCount}
            onSetPage={(page, debounce) => {
              console.log('setting page', page);
              setPage(page);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="skills"
          />
          <SummaryCardsContainer hasFilters={false}>
            {skills?.map((skill, idx) => {
              return (
                <SummaryCard
                  key={skill.id}
                  selected={skillId === skill.id}
                  onClick={() => setSkillId(skill.id)}
                  title={skill.name}
                  text={
                    <>
                      <div>{skill.name}</div>
                    </>
                  }
                  borderBottom={idx < skills.length - 1}
                />
              );
            })}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer hasFilters={false}>
          {skillId ? <SkillDetails id={skillId} paging={paging} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Skills;
