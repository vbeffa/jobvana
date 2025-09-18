import { Link, useLocation } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { JobvanaContext } from './Context';
import { getUserType } from './auth/utils';

const Header = () => {
  const location = useLocation();
  const { loggedIn, logout, company } = useContext(JobvanaContext);
  const [currPage, setCurrPage] = useState(
    () => location.pathname.substring(9) || 'home'
  );

  useEffect(() => {
    setCurrPage(location.pathname.substring(9) || 'home');
  }, [location.pathname]);

  const userType = getUserType();

  const activeHeaderItem = (title: string) => (
    <div>
      <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
        {title}
      </div>
    </div>
  );

  return (
    <div className="bg-blue-300 w-screen h-16 items-center justify-center mb-4 top-0 left-0 sticky z-10 flex gap-[5%]">
      {loggedIn !== undefined && userType && (
        <>
          {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
          {currPage === 'home' && activeHeaderItem('Home')}
          {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
          {currPage === 'about' && activeHeaderItem('About')}
          {loggedIn && (
            <>
              {userType === 'company' && company && (
                <>
                  {currPage !== 'companies' && (
                    <Link
                      to="/jobvana/companies/$id"
                      params={{ id: company.id.toString() }}
                    >
                      My Company
                    </Link>
                  )}
                  {currPage === 'companies' && activeHeaderItem('My Company')}
                </>
              )}
              {userType === 'job_seeker' && (
                <>
                  {currPage !== 'jobs' && <Link to="/jobvana/jobs">Jobs</Link>}
                  {currPage === 'jobs' && activeHeaderItem('Jobs')}
                  {currPage !== 'companies' && (
                    <Link to="/jobvana/companies">Companies</Link>
                  )}
                  {currPage === 'companies' && activeHeaderItem('Companies')}
                </>
              )}
              <Link to="/jobvana" onClick={logout}>
                Log out
              </Link>
              {/* {currPage !== 'roles' && <Link to="/jobvana/roles">Roles</Link>}
          {currPage === 'roles' && activeHeaderItem('Roles')}
          {currPage !== 'skills' && <Link to="/jobvana/skills">Skills</Link>}
          {currPage === 'skills' && activeHeaderItem('Skills')}
          {currPage !== 'skill_categories' && (
            <Link to="/jobvana/skill_categories">Skill Categories</Link>
          )}
          {currPage === 'skill_categories' &&
            activeHeaderItem('Skill Categories')} */}
              {/* {currPage !== 'applications' && (
            <Link to="/jobvana/applications">Applications</Link>
          )}
          {currPage === 'applications' && activeHeaderItem('Applications')} */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Header;
