import type { MouseEventHandler } from "react";

const Link = ({
  text,
  onClick
}: {
  text: string;
  onClick: MouseEventHandler;
}) => {
  return (
    <span className="text-blue-600 cursor-pointer" onClick={onClick}>
      {text}
    </span>
  );
};

export default Link;
