import type { JSX } from 'react';

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
      <div className={`min-h-12 overflow-auto ${isLast ? 'mb-2' : ''}`}>
        {children}
      </div>
      {!isLast && <hr className="my-4 border-gray-400 shadow" />}
    </div>
  );
};

export default Section;
