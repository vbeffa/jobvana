const UpdatingModal = () => {
  return (
    <div className="relative">
      <div
        className={`z-999 absolute w-64 h-16 left-[calc(50%-128px)]
                    bg-blue-300 rounded-lg text-center content-center
                    opacity-70`}
      >
        Loading...
      </div>
    </div>
  );
};

export default UpdatingModal;
