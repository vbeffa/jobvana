import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';

const ExpandCollapse = ({
  title,
  expanded,
  setExpanded
}: {
  title: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}) => {
  return (
    <div className="gap-1 -ml-1">
      <div className="flex flex-row">
        <div
          className="cursor-pointer content-center"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded && <FaAngleDown />}
          {!expanded && <FaAngleRight />}
        </div>
        {!expanded && <div>{title}</div>}
      </div>
    </div>
  );
};

export default ExpandCollapse;
