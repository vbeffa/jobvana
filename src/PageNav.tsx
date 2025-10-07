import { useMemo } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export const PAGE_NAV_HEIGHT = 16;
export const PAGE_NAV_HEIGHT_PX = 4 * PAGE_NAV_HEIGHT;

export type NavType = 'jobs' | 'companies' | 'skills';

export type PageNavProps = {
  page: number;
  pageSize?: number;
  total?: number;
  // debounce: true when typing in a new page number, false when clicking arrows
  onSetPage: (page: number, debounce: boolean) => void;
  isLoading: boolean;
  type: NavType;
  borderBottom?: boolean;
};

const PageNav = ({
  page,
  pageSize = 50,
  total,
  onSetPage,
  isLoading,
  type,
  borderBottom = true
}: PageNavProps) => {
  const numPages = useMemo(
    () => (total ? Math.ceil(total / pageSize) : undefined),
    [pageSize, total]
  );

  const navButtonStyles = (disabled: boolean) =>
    `content-center text-sm ${disabled ? 'text-gray-200' : 'text-gray-400 cursor-pointer'}`;

  return (
    <div
      className={`w-full overflow-auto ${borderBottom ? 'border-b-[0.5px] border-b-blue-300' : ''} h-${PAGE_NAV_HEIGHT} flex justify-center`}
    >
      <div className="text-gray-500 w-full flex flex-col justify-evenly items-center">
        {total !== 0 && (
          <div className="w-full flex flex-row justify-center gap-1">
            <div className={navButtonStyles(page === 1)}>
              <FaAngleDoubleLeft onClick={() => onSetPage(1, false)} />
            </div>
            <div className={navButtonStyles(page === 1)}>
              <FaAngleLeft onClick={() => onSetPage(page - 1, false)} />
            </div>
            <div className="content-center ml-1">
              <input
                id="page"
                type="number"
                step={1}
                min={1}
                max={numPages}
                disabled={isLoading}
                className="pagenav border-[.05rem] h-6 w-fit max-w-10 text-center
                     border-gray-400 rounded
                     disabled:bg-gray-50"
                value={total === 0 ? 0 : page}
                onChange={(e) => {
                  if (!numPages) {
                    return;
                  }
                  let page = parseInt(e.target.value);
                  if (isNaN(page)) {
                    return;
                  }
                  if (page < 1) {
                    page = 1;
                  } else if (page > numPages) {
                    page = numPages;
                  }
                  onSetPage(page, true);
                }}
              />
            </div>
            <div className="content-center">of</div>
            <div className="content-center mr-1">{numPages}</div>
            <div className={navButtonStyles(page === numPages)}>
              <FaAngleRight onClick={() => onSetPage(page + 1, false)} />
            </div>
            <div className={navButtonStyles(page === numPages)}>
              <FaAngleDoubleRight
                onClick={() => numPages && onSetPage(numPages, false)}
              />
            </div>
          </div>
        )}
        <div>
          <div className="content-center text-xs font-bold">
            {!isLoading && (
              <>
                {total} {type}
              </>
            )}
            {isLoading && <>Loading...</>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNav;
