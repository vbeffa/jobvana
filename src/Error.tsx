const Error = ({ error }: { error: Error }) => {
  return <div className="text-red-500">{error.message}</div>;
};

export default Error;
