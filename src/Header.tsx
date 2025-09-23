import { Link, useLocation } from '@tanstack/react-router';
import { useContext, useEffect } from 'react';
import { JobvanaContext } from './Context';
import { getUserType } from './auth/utils';

export const HEADER_HEIGHT = 16;
export const HEADER_MARGIN_BOTTOM = 4;
export const HEADER_TOTAL_HEIGHT_PX =
  4 * (HEADER_HEIGHT + HEADER_MARGIN_BOTTOM);

const Header = () => {
  const location = useLocation();
  const { logout, company, loggedIn, currPage, setCurrPage } =
    useContext(JobvanaContext);

  useEffect(() => {
    let trimmed = location.pathname.substring(9);
    if (trimmed.includes('/')) {
      trimmed = trimmed.substring(0, trimmed.indexOf('/'));
    }
    setCurrPage(trimmed || 'home');
  }, [location.pathname, setCurrPage]);

  const userType = getUserType();

  const activeHeaderItem = (title: string) => (
    <div>
      <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
        {title}
      </div>
    </div>
  );

  return (
    <div
      className={`bg-blue-300 w-screen h-${HEADER_HEIGHT} items-center justify-center mb-${HEADER_MARGIN_BOTTOM} top-0 left-0 sticky z-10 flex gap-8`}
    >
      {currPage !== 'home' && <Link to="/jobvana">Home</Link>}
      {currPage === 'home' && activeHeaderItem('Home')}
      {currPage !== 'about' && <Link to="/jobvana/about">About</Link>}
      {currPage === 'about' && activeHeaderItem('About')}
      {loggedIn && (
        <>
          {userType === 'company' && company !== null && (
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
              {currPage !== 'jobs' && <Link to="/jobvana/jobs">Jobs</Link>}
              {currPage === 'jobs' && activeHeaderItem('Jobs')}
              {currPage !== 'applications' && (
                <Link to="/jobvana/applications">Applications</Link>
              )}
              {currPage === 'applications' && activeHeaderItem('Applications')}
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
              {currPage !== 'applications' && (
                <Link to="/jobvana/applications">Applications</Link>
              )}
              {currPage === 'applications' && activeHeaderItem('Applications')}
            </>
          )}
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
