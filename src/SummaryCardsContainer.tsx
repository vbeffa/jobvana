import { type JSX } from 'react';

const SummaryCardsContainer = ({
  children,
  hasFilters = true
}: {
  children?: Array<JSX.Element>;
  hasFilters?: boolean;
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
    ? 'h-[calc(100dvh-308px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX + 1
    : 'h-[calc(100dvh-168px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX

  return <div className={`${height} overflow-y-auto`}>{children}</div>;
};

export default SummaryCardsContainer;
