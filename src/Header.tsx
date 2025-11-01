import { Link, useLocation, type LinkProps } from '@tanstack/react-router';
import { useContext, useEffect, useMemo, type JSX } from 'react';
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
import { type CurrPage } from './types';
import { isValidPage } from './utils';

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
    if (trimmed === '') {
      trimmed = 'home';
    }
    if (!isValidPage(trimmed)) {
      return;
    }
    setCurrPage(trimmed);
  }, [location.pathname, setCurrPage]);

  // for single resources (e.g. job details), we want to both underline the header item ('Jobs') and link to all resources (jobs)
  const isSingleResource = useMemo(
    () => location.pathname.substring(9).includes('/'),
    [location.pathname]
  );

  const userType = getUserType();

  const linkHeaderItem = ({
    page,
    to,
    params,
    title,
    icon,
    onClick
  }: {
    page?: CurrPage;
    to: LinkProps['to'];
    params?: LinkProps['params'];
    title: string;
    icon?: JSX.Element;
    onClick?: () => void;
  }) => {
    const underlineStyling =
      'border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center';

    return page !== currPage || (page === currPage && isSingleResource) ? (
      <Link to={to} params={params} onClick={onClick}>
        <div
          className={
            page === currPage && isSingleResource ? underlineStyling : ''
          }
        >
          <div className="flex flex-row gap-1">
            {icon && <div className="content-center">{icon}</div>}
            {title}
          </div>
        </div>
      </Link>
    ) : (
      <div>
        <div className={underlineStyling}>
          <div className="flex flex-row gap-1">
            {icon && <div className="content-center">{icon}</div>}
            {title}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`bg-blue-300 w-full overflow-auto whitespace-nowrap h-${HEADER_HEIGHT} items-center justify-center mb-${HEADER_MARGIN_BOTTOM} top-0 left-0 sticky z-999 flex gap-[2%]`}
    >
      {linkHeaderItem({
        page: 'home',
        to: '/jobvana',
        title: 'Home',
        icon: <FaHouse />
      })}
      {loggedIn && (
        <>
          {userType === 'company' && company !== null && (
            <>
              {linkHeaderItem({
                page: 'companies',
                to: company ? '/jobvana/companies/$id' : '.',
                params: company ? { id: company.id.toString() } : undefined,
                title: 'My Company',
                icon: <FaBuilding />
              })}
              {linkHeaderItem({
                page: 'jobs',
                to: '/jobvana/jobs',
                title: 'My Jobs',
                icon: <FaWrench />
              })}
              {linkHeaderItem({
                page: 'applications',
                to: '/jobvana/applications',
                title: 'Job Applications',
                icon: <FaPaperPlane />
              })}
            </>
          )}
          {userType === 'job_seeker' && jobSeeker !== null && (
            <>
              {linkHeaderItem({
                page: 'jobs',
                to: '/jobvana/jobs',
                title: 'Jobs',
                icon: <FaWrench />
              })}
              {linkHeaderItem({
                page: 'companies',
                to: '/jobvana/companies',
                title: 'Companies',
                icon: <FaBuilding />
              })}
              {linkHeaderItem({
                page: 'applications',
                to: '/jobvana/applications',
                title: 'My Applications',
                icon: <FaPaperPlane />
              })}
            </>
          )}
          {linkHeaderItem({
            page: 'account',
            to: '/jobvana/account',
            title: 'Account',
            icon: <FaUser />
          })}

          {linkHeaderItem({
            page: 'about',
            to: '/jobvana/about',
            title: 'About',
            icon: <FaBook />
          })}
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
