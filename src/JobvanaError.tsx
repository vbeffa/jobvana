const JobvanaError = ({ prefix, error }: { prefix?: string; error: Error }) => {
  return (
    <div className="pb-2 text-red-500 text-center font-bold">
      {prefix && `${prefix}:`} {error.message}
    </div>
  );
};

export default JobvanaError;
