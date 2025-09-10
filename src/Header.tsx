import { Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [currPage, setCurrPage] = useState(
    () => location.pathname.substring(9) || 'home'
  );

  useEffect(() => {
    setCurrPage(location.pathname.substring(9) || 'home');
  }, [location.pathname]);

  return (
    <div className="bg-blue-300 w-full h-16 items-center justify-center mb-4 top-0 left-0 sticky z-10 flex gap-[5%]">
      {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
      {currPage === 'home' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 content-center">
            Home
          </div>
        </div>
      )}
      {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
      {currPage === 'about' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            About
          </div>
        </div>
      )}
      {currPage !== 'jobs' && (
        <Link
          to="/jobvana/jobs"
          search={{
            page: 1,
            company: '',
            title: '',
            min_salary: 10000,
            max_salary: 200000
          }}
        >
          Jobs
        </Link>
      )}
      {currPage === 'jobs' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Jobs
          </div>
        </div>
      )}
      {currPage !== 'companies' && (
        <Link
          to="/jobvana/companies"
          search={{ page: 1, name: '', min_size: 1, max_size: 1000 }}
        >
          Companies
        </Link>
      )}
      {currPage === 'companies' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Companies
          </div>
        </div>
      )}
      {currPage !== 'roles' && (
        <Link to="/jobvana/roles" search={{ page: 1 }}>
          Roles
        </Link>
      )}
      {currPage === 'roles' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Roles
          </div>
        </div>
      )}
      {currPage !== 'skills' && (
        <Link to="/jobvana/skills" search={undefined}>
          Skills
        </Link>
      )}
      {currPage === 'skills' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Skills
          </div>
        </div>
      )}
      {currPage !== 'skill_categories' && (
        <Link to="/jobvana/skill_categories" search={undefined}>
          Skill Categories
        </Link>
      )}
      {currPage === 'skill_categories' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Skill Categories
          </div>
        </div>
      )}
      {/* {currPage !== 'applications' && (
        <Link
          to="/jobvana/applications"
          onClick={() => setCurrPage('applications')}
        >
          Applications
        </Link>
      )}
      {currPage === 'applications' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            Applications
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;
