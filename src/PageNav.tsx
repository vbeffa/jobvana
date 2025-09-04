import { useMemo } from 'react';

export type NavType = 'jobs' | 'companies';

export type PageNavProps = {
  page: number;
  pageSize?: number;
  total?: number;
  onSetPage: (page: number) => void;
  isLoading: boolean;
  type: NavType;
};
const PageNav = ({
  page,
  pageSize = 50,
  total,
  onSetPage,
  isLoading,
  type
}: PageNavProps) => {
  const numPages = useMemo(
    () => (total ? Math.ceil(total / pageSize) : undefined),
    [pageSize, total]
  );

  // if (total === 0 && isLoading) {
  //   return <div className="h-9">Loading...</div>;
  // }

  // if (isLoading) {
  //   return <div className="text-left h-9">Loading...</div>;
  // }

  // if (!numPages) {
  //   return <LoadingModal />;
  // }

  const navButtonStyles = `h-full w-6 pb-0.5
                           cursor-pointer
                           hover:text-gray-700
                           disabled:cursor-default
                           disabled:text-gray-300`;

  return (
    <div className="text-gray-500 flex flex-col h-16 justify-evenly items-center">
      {total !== 0 && (
        <div className="flex flex-row">
          <div>
            <input
              type="button"
              disabled={page === 1}
              className={navButtonStyles}
              onClick={() => onSetPage(1)}
              value="≪"
            />
          </div>
          <div>
            <input
              type="button"
              disabled={page === 1}
              className={navButtonStyles}
              onClick={() => onSetPage(page - 1)}
              value="<"
            />
          </div>
          <div className="content-center ml-2">
            <input
              type="number"
              step={1}
              min={1}
              max={numPages}
              disabled={isLoading}
              className="border-[.05rem] h-6 w-fit max-w-10 text-center
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
                onSetPage(page);
              }}
            />
          </div>
          <div className="content-center mx-2">of</div>
          <div className="content-center mr-2">{numPages}</div>
          <div>
            <input
              type="button"
              disabled={page === numPages}
              className={navButtonStyles}
              onClick={() => onSetPage(page + 1)}
              value=">"
            />
            <input
              type="button"
              disabled={page === numPages}
              className={navButtonStyles}
              onClick={() => numPages && onSetPage(numPages)}
              value="≫"
            />
          </div>
        </div>
      )}
      <div>
        <div className="content-center text-xs font-bold">
          {/* {!isLoading && `${total} total`} */}
          {/* {isLoading && 'Loading...'} */}
          {total !== undefined && (
            <>
              {total} {type}
            </>
          )}
          {total === undefined && <>Loading...</>}
        </div>
      </div>
    </div>
  );
};

export default PageNav;
