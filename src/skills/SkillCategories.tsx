import { useState } from 'react';
import useSkills from '../hooks/useSkills';
import SkillCategoriesTable from './SkillCategoriesTable';
import SkillCategoryTree from './SkillCategoryTree';

const SkillCategories = () => {
  const [view, setView] = useState<'tree' | 'table'>('tree');
  const { rootCategories, skills } = useSkills();

  return (
    <div className="mb-4">
      <h1>Skill Categories</h1>
      <div className="py-4 flex flex-row justify-center gap-10">
        <div>
          <input
            type="button"
            value="Tree"
            className={` ${view === 'tree' ? 'border-b-1 border-b-blue-500 bg-blue-200' : ''}`}
            onClick={() => setView('tree')}
          />
        </div>
        <div>
          <input
            type="button"
            value="Table"
            className={` ${view === 'table' ? 'border-b-1 border-b-blue-500 bg-blue-200' : ''}`}
            onClick={() => setView('table')}
          />
        </div>
      </div>
      <div>
        {view === 'tree' && rootCategories && skills && (
          <SkillCategoryTree skillCategories={rootCategories} skills={skills} />
        )}
      </div>
      <div className="mx-8">{view === 'table' && <SkillCategoriesTable />}</div>
    </div>
  );
};

export default SkillCategories;
