import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import Error from '../Error';
import FiltersContainer from '../FiltersContainer';
import PageNav from '../PageNav';
import ResourceDetailsContainer from '../ResourceDetailsContainer';
import ResourceListContainer from '../ResourceListContainer';
import ResourcesContainer from '../ResourcesContainer';
import SkillDetails from '../skills/SkillDetails';
import SummaryCard from '../SummaryCard';
import SummaryCardsContainer from '../SummaryCardsContainer';
import SkillFilters from './SkillFilters';
import useSkills, { type SearchFilters, type SkillsParams } from './useSkills';

const Skills = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: ''
  });
  const [debouncedName] = useDebounce(
    searchFilters.name,
    searchFilters.name ? 500 : 0
  );
  const [skillId, setSkillId] = useState<number | null>(null);

  const filters: SearchFilters = useMemo(
    () => ({
      ...searchFilters,
      name: debouncedName
    }),
    [debouncedName, searchFilters]
  );

  const paging: SkillsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { skills, error, isPending, isPlaceholderData, skillsCount } =
    useSkills({ paging, filters });

  useEffect(() => {
    setSkillId(skills?.[0]?.id ?? null);
  }, [skills]);

  return (
    <div className="mx-4">
      {error && <Error error={error} />}
      <FiltersContainer>
        <SkillFilters
          filters={searchFilters}
          setFilters={(filters) => {
            setPage(1);
            setSearchFilters(filters);
          }}
        />
      </FiltersContainer>
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
            pageSize={10}
            total={skillsCount}
            onSetPage={(page, debounce) => {
              setPage(page);
              setSkillId(null);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="skills"
          />
          <SummaryCardsContainer>
            {skills?.map((skill, idx) => {
              return (
                <SummaryCard
                  key={skill.id}
                  selected={skillId === skill.id}
                  onClick={() => setSkillId(skill.id)}
                  title={skill.name}
                  text={<div>{skill.skillCategory}</div>}
                  borderBottom={idx < skills.length - 1}
                />
              );
            })}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          {skillId ? <SkillDetails id={skillId} /> : undefined}
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </div>
  );
};

export default Skills;
