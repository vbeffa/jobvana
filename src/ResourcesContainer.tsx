import { useMemo, type JSX } from 'react';
import {
  FILTERS_TOTAL_HEIGHT_PX,
  HEADER_TOTAL_HEIGHT_PX,
  PAGE_MARGIN_BOTTOM_PX,
  TITLE_TOTAL_HEIGHT_PX
} from './page';

const ResourcesContainer = ({
  children,
  minWidth,
  hasFilters = true,
  hasTitle
}: {
  children: Array<JSX.Element> | JSX.Element;
  minWidth?: string;
  hasFilters?: boolean;
  hasTitle?: boolean;
}) => {
  const height = useMemo(() => {
    let heightPx = HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX;
    if (hasFilters) {
      heightPx += FILTERS_TOTAL_HEIGHT_PX;
    }
    if (hasTitle) {
      heightPx += TITLE_TOTAL_HEIGHT_PX;
    }
    return `h-[calc(100dvh-${heightPx}px)]`;
  }, [hasFilters, hasTitle]);

  return (
    <div className="flex justify-center">
      <div
        className={`border-[0.5px] border-blue-300 ${height} rounded-lg overflow-hidden w-[75%] ${
          minWidth ? minWidth : 'min-w-[1100px]'
        } flex flex-row`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourcesContainer;
