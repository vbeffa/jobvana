import { useState } from 'react';
import useSkills from '../hooks/useSkills';
import SkillCategoriesTable from './SkillCategoriesTable';
import SkillCategoryTree from './SkillCategoryTree';

const SkillCategories = () => {
  const [view, setView] = useState<'tree' | 'table'>('tree');
  const [open, setOpen] = useState(false);
  const { rootCategories, skills } = useSkills();

  return (
    <div className="mb-4">
      <h1>Skill Categories</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
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
              <>
                <div className="pl-13 pb-2">
                  <input
                    type="button"
                    value={`${open ? 'Collapse Tree' : 'Expand Tree'}`}
                    className="border-[0.5px] border-blue-500 text-blue-500"
                    onClick={() => setOpen((open) => !open)}
                  />
                </div>
                <SkillCategoryTree
                  skillCategories={rootCategories}
                  skills={skills}
                  open={open}
                />
              </>
            )}
          </div>
          <div className="mx-8">
            {view === 'table' && <SkillCategoriesTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCategories;
