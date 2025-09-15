import type { JSX } from 'react';

const Section = ({
  title,
  children,
  height = 16,
  isLast = false
}: {
  title: JSX.Element | string;
  children: JSX.Element | Array<JSX.Element | undefined> | string | null;
  height?: number;
  isLast?: boolean;
}) => {
  return (
    <>
      <h2>{title}</h2>
      <div className={`h-${height} overflow-auto ${isLast ? 'mb-2' : ''}`}>
        {children}
      </div>
      {!isLast && <hr className="my-4 border-gray-400 shadow" />}
    </>
  );
};

export default Section;
