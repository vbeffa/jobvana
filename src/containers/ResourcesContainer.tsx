import { type JSX } from 'react';

const ResourcesContainer = ({
  children,
  hasFilters = false,
  hasTitle = false,
  hasStatus = false
}: {
  children: Array<JSX.Element> | JSX.Element;
  hasFilters?: boolean;
  hasTitle?: boolean;
  hasStatus?: boolean;
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
    ? 'h-[calc(100dvh-173px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX = 80 + 16 + 77
    : hasTitle
      ? 'h-[calc(100dvh-168px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX = 80 + 16 + 72
      : hasStatus
        ? 'h-[calc(100dvh-136px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + STATUS_SELECT_TOTAL_HEIGHT_PX = 80 + 16 + 40
        : 'h-[calc(100dvh-96px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX = 80 + 16

  return (
    <div className="flex justify-center">
      <div
        className={`border-[0.5px] border-blue-300 ${height} rounded-lg overflow-hidden w-[80%] flex flex-row`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourcesContainer;
