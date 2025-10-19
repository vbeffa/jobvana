import { type JSX } from 'react';

// see comments in ResourcesContainer.tsx

const SummaryCardsContainer = ({
  children,
  bannerType = 'none'
}: {
  children?: Array<JSX.Element>;
  bannerType?: 'title' | 'filters' | 'status' | 'none';
}) => {
  const height = (() => {
    switch (bannerType) {
      case 'title':
        return 'h-[calc(100dvh-232px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 72 + 64
      case 'filters':
        return 'h-[calc(100dvh-232px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 72 + 64
      case 'status':
        return 'h-[calc(100dvh-200px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + STATUS_SELECT_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 40 + 64
      case 'none':
        // TODO check this value
        return 'h-[calc(100dvh-160px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 64
    }
  })();

  return <div className={`${height} truncate overflow-y-auto`}>{children}</div>;
};

export default SummaryCardsContainer;
