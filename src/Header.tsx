import { Link, useLocation } from '@tanstack/react-router';
import { useContext, useEffect, useState } from 'react';
import { JobvanaContext } from './Context';
import { getUserType } from './auth/utils';

const Header = () => {
  const location = useLocation();
  const { logout, company } = useContext(JobvanaContext);
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
      {!userType && (
        <>
          {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
          {currPage === 'home' && activeHeaderItem('Home')}
          {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
          {currPage === 'about' && activeHeaderItem('About')}
        </>
      )}
      {userType && (
        <>
          {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
          {currPage === 'home' && activeHeaderItem('Home')}
          {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
          {currPage === 'about' && activeHeaderItem('About')}
          {currPage !== 'jobs' && <Link to="/jobvana/jobs">Jobs</Link>}
          {currPage === 'jobs' && activeHeaderItem('Jobs')}
          {userType === 'company' && (
            <>
              {currPage !== 'companies' && (
                <>
                  <Link
                    to={company ? '/jobvana/companies/$id' : '.'}
                    params={company ? { id: company.id.toString() } : undefined}
                  >
                    Company
                  </Link>
                </>
              )}
              {currPage === 'companies' && activeHeaderItem('Company')}
            </>
          )}
          {userType === 'job_seeker' && (
            <>
              {currPage !== 'companies' && (
                <Link to="/jobvana/companies">Companies</Link>
              )}
              {currPage === 'companies' && activeHeaderItem('Companies')}
            </>
          )}
          {currPage !== 'applications' && (
            <Link to="/jobvana/applications">Applications</Link>
          )}
          {currPage === 'applications' && activeHeaderItem('Applications')}
          {currPage !== 'account' && <Link to="/jobvana/account">Account</Link>}
          {currPage === 'account' && activeHeaderItem('Account')}

          <Link to="/jobvana" onClick={logout}>
            Log out
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
