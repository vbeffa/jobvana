const Error = ({ error }: { error: Error }) => {
  return (
    <div className="text-red-500 text-center font-bold text-2xl">
      {error.message}
    </div>
  );
};

export default Error;
