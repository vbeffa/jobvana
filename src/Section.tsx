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
    <>
      <h2>{title}</h2>
      <div
        className={`min-h-12 max-h-24 overflow-auto ${isLast ? 'mb-2' : ''}`}
      >
        {children}
      </div>
      {!isLast && <hr className="my-4 border-gray-400 shadow" />}
    </>
  );
};

export default Section;
