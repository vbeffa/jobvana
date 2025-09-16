const Error = ({ error }: { error: Error }) => {
  return (
    <div className="text-red-500 text-center font-bold">{error.message}</div>
  );
};

export default Error;
