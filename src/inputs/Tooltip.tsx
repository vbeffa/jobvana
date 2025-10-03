import { useState, type JSX } from 'react';

const Tooltip = ({
  message,
  children,
  pos = 'top-[100%] left-[100%]'
}: {
  message: string | JSX.Element | null;
  children: string | JSX.Element;
  pos?: string;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && message && (
        <div className={`absolute size-fit ${pos} z-10`}>
          <div className="size-fit whitespace-nowrap text-sm border-[0.5px] border-gray-600 rounded-sm text-gray-600 bg-gray-200 p-1">
            {message}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
