import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import FiltersContainer from '../containers/FiltersContainer';
import ResourceDetailsContainer from '../containers/ResourceDetailsContainer';
import ResourceListContainer from '../containers/ResourceListContainer';
import ResourcesContainer from '../containers/ResourcesContainer';
import SummaryCardsContainer from '../containers/SummaryCardsContainer';
import JobvanaError from '../JobvanaError';
import PageNav from '../PageNav';
import SkillDetails from '../skills/SkillDetails';
import SummaryCard from '../SummaryCard';
import ActiveFilters from './ActiveFilters';
import SkillFilters from './SkillFilters';
import useSkills, { type SearchFilters, type SkillsParams } from './useSkills';
import { INITIAL_SEARCH_FILTERS } from './utils';

const Skills = () => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(
    INITIAL_SEARCH_FILTERS
  );
  const [skillId, setSkillId] = useState<number | null>(null);

  const paging: SkillsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );

  const { skills, error, isPending, isPlaceholderData, skillsCount } =
    useSkills({ paging, filters: searchFilters });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkillId(skills?.[0]?.id ?? null);
  }, [skills]);

  return (
    <div className="mx-0">
      {error && <JobvanaError error={error} />}
      <FiltersContainer
        activeFilters={
          <ActiveFilters
            filters={searchFilters}
            setFilters={setSearchFilters}
          />
        }
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        reset={() => {
          setPage(1);
          setSkillId(null);
          setSearchFilters(INITIAL_SEARCH_FILTERS);
        }}
        resetDisabled={_.isEqual(searchFilters, INITIAL_SEARCH_FILTERS)}
      />
      {showFilters && (
        <SkillFilters
          filters={searchFilters}
          setShowFilters={setShowFilters}
          onChange={(filters) => {
            setPage(1);
            setSkillId(null);
            setSearchFilters(filters);
          }}
        />
      )}
      <ResourcesContainer>
        <ResourceListContainer>
          <PageNav
            page={page}
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
