import { useState } from 'react';
import useSkillCategories from '../hooks/useSkillCategories';
import useSkills from '../hooks/useSkills';
import SkillCategoryTree from './SkillCategoryTree';

const SkillCategories = () => {
  const [open, setOpen] = useState(false);
  const { skills } = useSkills();
  const { rootCategories } = useSkillCategories();

  return (
    <div className="mb-4">
      <h1>Skill Categories</h1>
      <div className="flex justify-center">
        <div className="my-4 w-[50%] min-w-[1000px]">
          <div>
            {rootCategories && skills && (
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
        </div>
      </div>
    </div>
  );
};

export default SkillCategories;
