import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [currPage, setCurrPage] = useState<string>(
    location.pathname.substring(9) || 'home'
  );

  return (
    <div className="bg-blue-300 w-full h-16 items-center justify-center mb-4 top-0 left-0 sticky z-10 flex gap-[5%]">
      {currPage !== 'home' && (
        <Link to="/jobvana" onClick={() => setCurrPage('home')}>
          Home
        </Link>
      )}
      {currPage === 'home' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 content-center">
            Home
          </div>
        </div>
      )}
      {currPage !== 'about' && (
        <Link to="/jobvana/about" onClick={() => setCurrPage('about')}>
          About
        </Link>
      )}
      {currPage === 'about' && (
        <div>
          <div className="border-b-3 border-b-blue-600 pt-[3px] h-16 w-full content-center">
            About
          </div>
        </div>
      )}
      {currPage !== 'jobs' && (
        <Link to="/jobvana/jobs" onClick={() => setCurrPage('jobs')}>
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
        <Link to="/jobvana/companies" onClick={() => setCurrPage('companies')}>
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
      {currPage !== 'applications' && (
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
      )}
    </div>
  );
};

export default Header;
