import { useMemo } from 'react';

const PageNav = ({
  page,
  pageSize = 50,
  total,
  onSetPage,
  isLoading
}: {
  page: number;
  pageSize?: number;
  total?: number;
  onSetPage: (page: number) => void;
  isLoading: boolean;
}) => {
  const numPages = useMemo(
    () => (total ? Math.ceil(total / pageSize) : undefined),
    [pageSize, total]
  );

  if (total === 0 && !isLoading) {
    return <div className="h-9"></div>;
  }

  if (!numPages) {
    return <>Loading...</>;
  }

  return (
    <div className="flex w-fit h-9 content-center align-middle gap-2">
      <div>
        <input
          type="button"
          disabled={page === 1 || isLoading}
          className="border-[.05rem] h-full w-10
                     border-gray-400 rounded-lg
                     cursor-pointer
                     hover:bg-gray-300
                     disabled:cursor-default
                     disabled:bg-gray-50"
          onClick={() => onSetPage(page - 1)}
          value="←"
        />
      </div>
      <div className="content-center">Page</div>
      <div className="content-center">
        <input
          type="number"
          step={1}
          min={1}
          max={numPages}
          disabled={isLoading}
          className="border-[.05rem] h-9 pr-1 text-center
                     border-gray-400 rounded-lg
                     disabled:bg-gray-50"
          value={page}
          onChange={(e) => {
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
      <div className="content-center">of</div>
      <div className="content-center">{numPages} </div>
      <div>
        <input
          type="button"
          disabled={page === numPages || isLoading}
          className="border-[.05rem] h-full w-10
                     border-gray-400 rounded-lg
                     cursor-pointer
                     hover:bg-gray-300
                     disabled:cursor-default
                     disabled:bg-gray-50"
          onClick={() => onSetPage(page + 1)}
          value="→"
        />
      </div>
      <div className="content-center">
        {!isLoading && `${total} total`}
        {isLoading && 'Loading...'}
      </div>
    </div>
  );
};

export default PageNav;
