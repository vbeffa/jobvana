import { useMemo } from "react";

const PageNav = ({
  page,
  pageSize = 50,
  total,
  onSetPage
}: {
  page: number;
  pageSize?: number;
  total: number;
  onSetPage: (page: number) => void;
}) => {
  const numPages = useMemo(
    () => Math.ceil(total / pageSize),
    [pageSize, total]
  );

  return (
    <div className="flex w-fit h-9 content-center align-middle gap-2">
      <div>
        <input
          type="button"
          disabled={page === 1}
          className="border-[.05rem] h-full w-10
                   border-gray-400 rounded-lg
                     cursor-pointer
                     hover:bg-gray-300
                     disabled:cursor-default
                     disabled:bg-gray-50
                     disabled:hover:border-[.05rem] 
                     disabled:hover:border-gray-400"
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
          className="border-[.05rem] h-9 pr-1 rounded-lg border-gray-500 text-center"
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
      <div className="content-center">{numPages}</div>
      <div>
        <input
          type="button"
          disabled={page === numPages}
          className="border-[.05rem] h-full w-10
                   border-gray-400 rounded-lg
                     cursor-pointer
                     hover:bg-gray-300
                     disabled:cursor-default
                     disabled:bg-gray-50
                     disabled:hover:border-[.05rem] 
                     disabled:hover:border-gray-400"
          onClick={() => onSetPage(page + 1)}
          value="→"
        />
      </div>
      <div className="content-center">{total} total</div>
    </div>
  );
};

export default PageNav;
