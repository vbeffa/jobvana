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

  const activeHeaderItem = (title: string) => (
    <div>
      <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
        {title}
      </div>
    </div>
  );

  return (
    <div className="bg-blue-300 w-screen h-16 items-center justify-center mb-4 top-0 left-0 sticky z-10 flex gap-[5%]">
      {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
      {currPage === 'home' && activeHeaderItem('Home')}
      {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
      {currPage === 'about' && activeHeaderItem('About')}
      {currPage !== 'jobs' && <Link to="/jobvana/jobs">Jobs</Link>}
      {currPage === 'jobs' && activeHeaderItem('Jobs')}
      {currPage !== 'companies' && (
        <Link to="/jobvana/companies">Companies</Link>
      )}
      {currPage === 'companies' && activeHeaderItem('Companies')}
      {/* {currPage !== 'roles' && <Link to="/jobvana/roles">Roles</Link>}
      {currPage === 'roles' && activeHeaderItem('Roles')}
      {currPage !== 'skills' && <Link to="/jobvana/skills">Skills</Link>}
      {currPage === 'skills' && activeHeaderItem('Skills')}
      {currPage !== 'skill_categories' && (
        <Link to="/jobvana/skill_categories">Skill Categories</Link>
      )}
      {currPage === 'skill_categories' && activeHeaderItem('Skill Categories')} */}
      {/* {currPage !== 'applications' && (
        <Link to="/jobvana/applications">Applications</Link>
      )}
      {currPage === 'applications' && activeHeaderItem('Applications')} */}
    </div>
  );
};

export default Header;
