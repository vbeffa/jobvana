import type { JSX } from 'react';

const ActionMenuContainer = ({
  children,
  justify = 'justify-between'
}: {
  children:
    | JSX.Element
    | Array<JSX.Element | false | null | undefined>
    | false
    | null
    | undefined;
  justify?: 'justify-between' | 'justify-end';
}) => {
  return (
    <div className="sticky top-0 z-998 bg-blue-300 text-blue-500">
      {/* need relative for EditDeleteIcons */}
      <div className={`relative mx-4 h-7 flex flex-row gap-2 ${justify}`}>
        {children}
      </div>
    </div>
  );
};

// const LeftSide = ({
//   children
// }: {
//   children:
//     | JSX.Element
//     | Array<JSX.Element | false | null | undefined>
//     | false
//     | null
//     | undefined;
// }) => {
//   return (
//     <div className="flex flex-row gap-1 items-center text-sm">{children}</div>
//   );
// };

export default ActionMenuContainer;
