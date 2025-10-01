import { type JSX } from 'react';

const ResourcesContainer = ({
  children,
  hasFilters = true,
  hasTitle = true
}: {
  children: Array<JSX.Element> | JSX.Element;
  hasFilters?: boolean;
  hasTitle?: boolean;
}) => {
  // const height = useMemo(() => {
  //   let heightPx = HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX;
  //   if (hasFilters) {
  //     heightPx += FILTERS_TOTAL_HEIGHT_PX;
  //   }
  //   if (hasTitle) {
  //     heightPx += TITLE_TOTAL_HEIGHT_PX;
  //   }
  //   return `h-[calc(100dvh-${heightPx}px)]`;
  // }, [hasFilters, hasTitle]);

  const height = hasFilters
    ? 'h-[calc(100dvh-243px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX
    : hasTitle
      ? 'h-[calc(100dvh-168px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX
      : 'h-[calc(100dvh-96px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX

  return (
    <div className="flex justify-center">
      <div
        className={`border-[0.5px] border-blue-300 ${height} rounded-lg overflow-hidden w-full flex flex-row`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourcesContainer;
