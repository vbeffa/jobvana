import { useMemo, type JSX } from 'react';
import {
  FILTERS_TOTAL_HEIGHT_PX,
  HEADER_TOTAL_HEIGHT_PX,
  PAGE_MARGIN_BOTTOM_PX,
  PAGE_NAV_HEIGHT_PX,
  TITLE_TOTAL_HEIGHT_PX
} from './page';

const SummaryCardsContainer = ({
  children,
  hasFilters = true,
  hasTitle
}: {
  children?: Array<JSX.Element>;
  hasFilters?: boolean;
  hasTitle?: boolean;
}) => {
  const height = useMemo(() => {
    let heightPx =
      HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + PAGE_NAV_HEIGHT_PX;
    if (hasFilters) {
      heightPx += FILTERS_TOTAL_HEIGHT_PX;
    }
    if (hasTitle) {
      heightPx += TITLE_TOTAL_HEIGHT_PX;
    }
    return `h-[calc(100dvh-${heightPx + 1}px)]`;
  }, [hasFilters, hasTitle]);

  return <div className={`${height} overflow-y-auto`}>{children}</div>;
};

export default SummaryCardsContainer;
