import type { JSX } from 'react';
import Hr from './Hr';

const Section = ({
  title,
  children,
  isLast = false
}: {
  title: JSX.Element | string;
  children: JSX.Element | Array<JSX.Element | undefined> | string | null;
  isLast?: boolean;
}) => {
  return (
    <div className="relative">
      <h2>{title}</h2>
      <div className={`min-h-12 overflow-auto ${isLast ? 'mb-4' : ''}`}>
        {children}
      </div>
      {!isLast && <Hr />}
    </div>
  );
};

export default Section;
