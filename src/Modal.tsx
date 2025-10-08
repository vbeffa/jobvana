import _ from 'lodash';

export type ModalType =
  | 'loading'
  | 'updating'
  | 'uploading'
  | 'downloading'
  | 'deleting';

const Modal = ({ type }: { type: ModalType }) => {
  return (
    <div className="relative">
      <div
        className={`z-999 absolute w-64 h-16 left-[calc(50%-128px)]
                    bg-blue-300 rounded-lg text-center content-center
                    opacity-70`}
      >
        {_.capitalize(type)}...
      </div>
    </div>
  );
};

export default Modal;
