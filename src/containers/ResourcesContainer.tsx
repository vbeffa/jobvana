import { type JSX } from 'react';

//        HEADER_TOTAL_HEIGHT_PX = 80
//         PAGE_MARGIN_BOTTOM_PX = 16

//    <h1> TITLE_TOTAL_HEIGHT_PX = 72
// STATUS_SELECT_TOTAL_HEIGHT_PX = 40

//             FILTERS_HEIGHT_PX = 55 + 1; // 1px for border
//      FILTERS_MARGIN_BOTTOM_PX = 4 * 4;
//       FILTERS_TOTAL_HEIGHT_PX = 72; // FILTERS_HEIGHT_PX + FILTERS_MARGIN_BOTTOM_PX;

const ResourcesContainer = ({
  children,
  bannerType = 'none'
}: {
  children: Array<JSX.Element> | JSX.Element;
  bannerType?: 'title' | 'filters' | 'status' | 'none';
}) => {
  const height = (() => {
    switch (bannerType) {
      case 'title':
        return 'h-[calc(100dvh-168px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + TITLE_TOTAL_HEIGHT_PX = 80 + 16 + 72
      case 'filters':
        return 'h-[calc(100dvh-168px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + FILTERS_TOTAL_HEIGHT_PX = 80 + 16 + 72
      case 'status':
        return 'h-[calc(100dvh-136px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX + STATUS_SELECT_TOTAL_HEIGHT_PX = 80 + 16 + 40
      case 'none':
        return 'h-[calc(100dvh-96px)]'; // HEADER_TOTAL_HEIGHT_PX + PAGE_MARGIN_BOTTOM_PX = 80 + 16
    }
  })();

  return (
    <div className="flex justify-center">
      <div
        className={`border-[0.5px] border-blue-300 ${height} rounded-lg overflow-hidden w-[85%] flex flex-row`}
      >
        {children}
      </div>
    </div>
  );
};

export default ResourcesContainer;
