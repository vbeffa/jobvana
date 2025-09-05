const LoadingModal = () => {
  return (
    <div className="relative">
      <div
        className={`z-999 absolute top-0 left-[calc(50%-128px)]
                       w-64 h-16 bg-blue-300 rounded-lg
                       text-center pt-5 opacity-70`}
      >
        Loading...
      </div>
    </div>
  );
};

export default LoadingModal;
