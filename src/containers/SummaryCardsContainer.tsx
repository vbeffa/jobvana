import { type JSX } from 'react';

// see additional constants in ResourcesContainer.tsx
// PAGE_NAV_HEIGHT_PX = 64

const SummaryCardsContainer = ({
  children,
  bannerType = 'none',
  hasPageNav = true
}: {
  children?: JSX.Element | Array<JSX.Element>;
  bannerType?: 'title' | 'filters' | 'status' | 'none';
  hasPageNav?: boolean;
}) => {
  const height = (() => {
    switch (bannerType) {
      case 'title':
        return hasPageNav
          ? 'h-[calc(100dvh-232px)]' //  HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 72 + 64
          : 'h-[calc(100dvh-168px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX = 80 + 16 + 72
      case 'filters':
        return hasPageNav
          ? 'h-[calc(100dvh-232px)]' //  HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 72 + 64
          : 'h-[calc(100dvh-168px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX = 80 + 16 + 72
      case 'status':
        return hasPageNav
          ? 'h-[calc(100dvh-200px)]' //  HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + STATUS_SELECT_TOTAL_HEIGHT_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 40 + 64
          : 'h-[calc(100dvh-136px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + STATUS_SELECT_TOTAL_HEIGHT_PX = 80 + 16 + 40
      case 'none':
        // TODO check this value
        return hasPageNav
          ? 'h-[calc(100dvh-160px)]' // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + PAGE_NAV_HEIGHT_PX = 80 + 16 + 64
          : 'h-[calc(100dvh-96px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX = 80 + 16
    }
  })();

  return <div className={`${height} truncate overflow-y-auto`}>{children}</div>;
};

export default SummaryCardsContainer;
