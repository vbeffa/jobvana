import { type JSX } from 'react';

const SummaryCardsContainer = ({
  children,
  hasFilters = false,
  hasTitle = false,
  hasStatus = false
}: {
  children?: Array<JSX.Element>;
  hasFilters?: boolean;
  hasTitle?: boolean;
  hasStatus?: boolean;
}) => {
  // const height = useMemo(() => {
  //   let heightPx =
  //     HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + PAGE_NAV_HEIGHT_PX;
  //   if (hasFilters) {
  //     heightPx += FILTERS_TOTAL_HEIGHT_PX;
  //   }
  //   if (hasTitle) {
  //     heightPx += TITLE_TOTAL_HEIGHT_PX;
  //   }
  //   return `h-[calc(100dvh-${heightPx + 1}px)]`;
  // }, [hasFilters, hasTitle]);

  const height = hasFilters
    ? 'h-[calc(100dvh-237px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 77 + 64
    : hasTitle
      ? 'h-[calc(100dvh-232px)]'
      : hasStatus
        ? 'h-[calc(100dvh-200px)]'
        : 'h-[calc(100dvh-160px)]'; // TODO check this value // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX = 80 + 16 + 72

  return <div className={`${height} truncate overflow-y-auto`}>{children}</div>;
};

export default SummaryCardsContainer;
