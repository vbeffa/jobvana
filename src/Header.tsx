import { Link, useLocation, type LinkProps } from '@tanstack/react-router';
import { useContext, useEffect, type JSX } from 'react';
import {
  FaArrowRightToBracket,
  FaBook,
  FaBuilding,
  FaHouse,
  FaPaperPlane,
  FaUser,
  FaWrench
} from 'react-icons/fa6';
import { getUserType } from './auth/utils';
import { CompanyContext, JobSeekerContext, JobvanaContext } from './Context';

export const HEADER_HEIGHT = 16;
export const HEADER_MARGIN_BOTTOM = 4;
export const HEADER_TOTAL_HEIGHT_PX =
  4 * (HEADER_HEIGHT + HEADER_MARGIN_BOTTOM);

const Header = () => {
  const location = useLocation();
  const { logout, loggedIn, currPage, setCurrPage } =
    useContext(JobvanaContext);
  const { company } = useContext(CompanyContext);
  const { jobSeeker } = useContext(JobSeekerContext);

  useEffect(() => {
    let trimmed = location.pathname.substring(9);
    if (trimmed.includes('/')) {
      trimmed = trimmed.substring(0, trimmed.indexOf('/'));
    }
    setCurrPage(trimmed || 'home');
  }, [location.pathname, setCurrPage]);

  const userType = getUserType();

  const activeHeaderItem = (title: string, icon?: JSX.Element) => {
    return (
      <div>
        <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
          <div className="flex flex-row gap-1">
            {icon && <div className="content-center">{icon}</div>}
            {title}
          </div>
        </div>
      </div>
    );
  };

  const linkHeaderItem = ({
    to,
    params,
    title,
    icon,
    onClick
  }: {
    to: LinkProps['to'];
    params?: LinkProps['params'];
    title: string;
    icon?: JSX.Element;
    onClick?: () => void;
  }) => {
    return (
      <Link to={to} params={params} onClick={onClick}>
        <div className="flex flex-row gap-1">
          {icon && <div className="content-center">{icon}</div>}
          {title}
        </div>
      </Link>
    );
  };

  return (
    <div
      className={`bg-blue-300 w-[100%] overflow-auto whitespace-nowrap h-${HEADER_HEIGHT} items-center justify-center mb-${HEADER_MARGIN_BOTTOM} top-0 left-0 sticky z-10 flex gap-[2%]`}
    >
      {currPage !== 'home' &&
        linkHeaderItem({ to: '/jobvana', title: 'Home', icon: <FaHouse /> })}
      {currPage === 'home' && activeHeaderItem('Home', <FaHouse />)}
      {loggedIn && (
        <>
          {userType === 'company' && company !== null && (
            <>
              {currPage !== 'companies' &&
                linkHeaderItem({
                  to: company ? '/jobvana/companies/$id' : '.',
                  params: company ? { id: company.id.toString() } : undefined,
                  title: 'My Company',
                  icon: <FaBuilding />
                })}
              {currPage === 'companies' &&
                activeHeaderItem('My Company', <FaBuilding />)}
              {currPage !== 'jobs' &&
                linkHeaderItem({
                  to: '/jobvana/jobs',
                  title: 'My Jobs',
                  icon: <FaWrench />
                })}
              {currPage === 'jobs' && activeHeaderItem('My Jobs', <FaWrench />)}
              {currPage !== 'applications' &&
                linkHeaderItem({
                  to: '/jobvana/applications',
                  title: 'Job Applications',
                  icon: <FaPaperPlane />
                })}
              {currPage === 'applications' &&
                activeHeaderItem('Job Applications', <FaPaperPlane />)}
            </>
          )}
          {userType === 'job_seeker' && jobSeeker !== null && (
            <>
              {currPage !== 'jobs' &&
                linkHeaderItem({
                  to: '/jobvana/jobs',
                  title: 'Jobs',
                  icon: <FaWrench />
                })}
              {currPage === 'jobs' && activeHeaderItem('Jobs', <FaWrench />)}
              {currPage !== 'companies' &&
                linkHeaderItem({
                  to: '/jobvana/companies',
                  title: 'Companies',
                  icon: <FaBuilding />
                })}
              {currPage === 'companies' &&
                activeHeaderItem('Companies', <FaBuilding />)}
              {currPage !== 'applications' &&
                linkHeaderItem({
                  to: '/jobvana/applications',
                  title: 'My Applications',
                  icon: <FaPaperPlane />
                })}
              {currPage === 'applications' &&
                activeHeaderItem('My Applications', <FaPaperPlane />)}
            </>
          )}
          {currPage !== 'account' &&
            linkHeaderItem({
              to: '/jobvana/account',
              title: 'Account',
              icon: <FaUser />
            })}
          {currPage === 'account' && activeHeaderItem('Account', <FaUser />)}

          {currPage !== 'about' &&
            linkHeaderItem({
              to: '/jobvana/about',
              title: 'About',
              icon: <FaBook />
            })}
          {currPage === 'about' && activeHeaderItem('About', <FaBook />)}
          {linkHeaderItem({
            to: '/jobvana',
            title: 'Log out',
            icon: <FaArrowRightToBracket />,
            onClick: logout
          })}
        </>
      )}
    </div>
  );
};

export default Header;
