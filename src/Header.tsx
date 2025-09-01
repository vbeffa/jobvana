import { Link } from '@tanstack/react-router';
import './App.css';
import { useState } from 'react';

const Header = () => {
  const [currPage, setCurrPage] = useState<string>('home');

  return (
    <div className="bg-amber-300 flex gap-2 w-full h-12 pl-2 pt-2.5 mb-4 top-0 left-0 sticky z-10">
      {currPage !== 'home' && (
        <Link
          to="/jobvana"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('home')}
        >
          Home
        </Link>
      )}
      {currPage === 'home' && <span>Home</span>}
      {' • '}
      {currPage !== 'about' && (
        <Link
          to="/jobvana/about"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('about')}
        >
          About
        </Link>
      )}
      {currPage === 'about' && <span>About</span>}
      {' • '}
      {currPage !== 'jobs' && (
        <Link
          to="/jobvana/jobs"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('jobs')}
        >
          Jobs
        </Link>
      )}
      {currPage === 'jobs' && <span>Jobs</span>}
      {' • '}
      {currPage !== 'companies' && (
        <Link
          to="/jobvana/companies"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('companies')}
        >
          Companies
        </Link>
      )}
      {currPage === 'companies' && <span>Companies</span>}
      {' • '}
      {currPage !== 'roles' && (
        <Link
          to="/jobvana/roles"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('roles')}
        >
          Roles
        </Link>
      )}
      {currPage === 'roles' && <span>Roles</span>}
      {' • '}
      {currPage !== 'skills' && (
        <Link
          to="/jobvana/skills"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('skills')}
        >
          Skills
        </Link>
      )}
      {currPage === 'skills' && <span>Skills</span>}
      {' • '}
      {currPage !== 'skill_categories' && (
        <Link
          to="/jobvana/skill_categories"
          className="[&.active]:font-bold"
          onClick={() => setCurrPage('skill_categories')}
        >
          Skill Categories
        </Link>
      )}
      {currPage === 'skill_categories' && <span>Skill Categories</span>}
    </div>
  );
};

export default Header;
