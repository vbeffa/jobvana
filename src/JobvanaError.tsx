import { useState } from 'react';
import { FaX } from 'react-icons/fa6';

const JobvanaError = ({ prefix, error }: { prefix?: string; error: Error }) => {
  const [visible, setVisible] = useState(true);
  return (
    visible && (
      <div
        className="z-999 absolute w-64 h-16 left-[calc(50%-128px)]
                    bg-red-300 text-red-600 font-bold rounded-lg text-center content-center
                    opacity-95"
      >
        {prefix && `${prefix}:`} {error.message}
        <div className="absolute top-2 right-2">
          <FaX
            className="hover:text-red-500 cursor-pointer"
            onClick={() => setVisible(false)}
          />
        </div>
      </div>
    )
  );
};

export default JobvanaError;
