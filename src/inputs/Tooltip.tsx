import { useState, type JSX } from 'react';

const Tooltip = ({
  message,
  children
}: {
  message: string;
  children: JSX.Element;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`absolute text-red-500 top-2 right-6 flex flex-row gap-1`}
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className="absolute size-64 top-3 left-5 z-10">
          <div className="size-fit text-sm border-[0.5px] border-gray-600 rounded-sm text-gray-600 bg-gray-200 p-1">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
