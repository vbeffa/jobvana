import { useMemo } from 'react';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';

export const PAGE_NAV_HEIGHT = 16;
export const PAGE_NAV_HEIGHT_PX = 4 * PAGE_NAV_HEIGHT;

export type NavType = 'jobs' | 'companies' | 'skills' | 'applications';

export type PageNavProps = {
  page: number;
  pageSize?: number;
  total?: number;
  disabled?: boolean;
  // debounce: true when typing in a new page number, false when clicking arrows
  onSetPage: (page: number, debounce: boolean) => void;
  isLoading: boolean;
  type: NavType;
  borderBottom?: boolean;
};

const PageNav = ({
  page,
  pageSize = 10,
  disabled = false,
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

  const navButtonStyles = (isDisabled: boolean) =>
    `content-center text-sm ${isDisabled || disabled ? 'text-gray-200' : 'text-gray-400 cursor-pointer'}`;

  return (
    <div
      className={`w-full overflow-auto ${borderBottom ? 'border-b-[0.5px] border-b-blue-300' : ''} h-${PAGE_NAV_HEIGHT} flex justify-center`}
    >
      <div className="text-gray-500 w-full flex flex-col justify-evenly items-center">
        {total !== 0 && (
          <div className="w-full flex flex-row justify-center gap-1">
            <div className={navButtonStyles(page === 1)}>
              <FaAngleDoubleLeft
                onClick={() => {
                  if (disabled || page === 1) {
                    return;
                  }
                  onSetPage(1, false);
                }}
              />
            </div>
            <div className={navButtonStyles(page === 1)}>
              <FaAngleLeft
                onClick={() => {
                  if (disabled || page === 1) {
                    return;
                  }
                  onSetPage(page - 1, false);
                }}
              />
            </div>
            <div className="content-center ml-1">
              <input
                id="page"
                type="number"
                step={1}
                min={1}
                max={numPages}
                disabled={isLoading || disabled}
                className="pagenav border-[.05rem] h-6 w-10 max-w-10 text-center
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
            <div className="content-center mr-1">{numPages ?? 1}</div>
            <div className={navButtonStyles(page === numPages)}>
              <FaAngleRight
                onClick={() => {
                  if (disabled || page === numPages) {
                    return;
                  }
                  onSetPage(page + 1, false);
                }}
              />
            </div>
            <div className={navButtonStyles(page === numPages)}>
              <FaAngleDoubleRight
                onClick={() => {
                  if (disabled || !numPages || page === numPages) {
                    return;
                  }
                  onSetPage(numPages, false);
                }}
              />
            </div>
          </div>
        )}
        <div>
          <div className="content-center text-xs font-bold">
            {!isLoading && (
              <>
                {total}{' '}
                {total !== 1 ? type : type.substring(0, type.length - 1)}
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
