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
      {currPage === 'home' && <span>Home</span>}
      {currPage !== 'about' && (
        <Link to="/jobvana/about" onClick={() => setCurrPage('about')}>
          About
        </Link>
      )}
      {currPage === 'about' && <span>About</span>}
      {currPage !== 'jobs' && (
        <Link to="/jobvana/jobs" onClick={() => setCurrPage('jobs')}>
          Jobs
        </Link>
      )}
      {currPage === 'jobs' && <span>Jobs</span>}
      {currPage !== 'companies' && (
        <Link to="/jobvana/companies" onClick={() => setCurrPage('companies')}>
          Companies
        </Link>
      )}
      {currPage === 'companies' && <span>Companies</span>}
      {currPage !== 'applications' && (
        <Link
          to="/jobvana/applications"
          onClick={() => setCurrPage('applications')}
        >
          Applications
        </Link>
      )}
      {currPage === 'applications' && <span>Applications</span>}
    </div>
  );
};

export default Header;
