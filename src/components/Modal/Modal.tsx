import { type ReactNode, type FC } from 'react';
import { useInnerModalDispatch, useModalDispatch } from '@/store/hooks';
import { createPortal } from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { onCloseModal } from './modalSlice';
import { onCloseInnerModal } from './innerModalSlice';

interface ModalProps {
  children: ReactNode;
  title: string;
  subTitle?: string;
  className?: string;
}

const Modal: FC<ModalProps> = ({ children, title, subTitle, className }) => {
  const dispatch = useModalDispatch();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20212c72] dark:bg-[#20212cd9]">
      <div
        className={`w-[100%] sm:w-[90%] md:w-[100%] lg:w-[85%] max-w-[85%] max-h-[90vh] overflow-y-auto rounded-md bg-white dark:bg-[#2b2c37] dark:border dark:border-slate-700 text-text-color dark:text-[#f8f8ff] shadow-xl p-4 transition-all duration-300 ease-in-out ${className ?? ''}`}
      >
        <div className="flex items-center justify-between border-b border-gray-300 dark:border-slate-600 pb-2 mb-3">
          <div>
            <h2 className="font-semibold text-base sm:text-lg">{title}</h2>
            {subTitle && <p className="text-xs text-gray-500">{subTitle}</p>}
          </div>
          <button
            onClick={() => dispatch(onCloseModal())}
            className="h-6 w-6 rounded flex items-center justify-center bg-slate-100 dark:bg-dark100 hover:bg-gray-200 dark:hover:bg-gray-500 text-text-color dark:text-white transition-all border dark:border-slate-600"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

interface InnerModalProps {
  children: ReactNode;
  title: string;
}

export const InnerModal: FC<InnerModalProps> = ({ title, children }) => {
  const dispatch = useInnerModalDispatch();

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#20212c72] text-text-color transition-all">
      <div className="w-[90%] sm:w-[80%] md:w-[75%] lg:w-[90%] max-w-[100%] max-h-[90vh] overflow-y-auto rounded-md bg-white dark:bg-[#2b2c37] shadow-xl p-4 transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-300 dark:border-slate-600">
          <h3 className="font-bold">{title}</h3>
          <button
            onClick={() => dispatch(onCloseInnerModal())}
            className="h-6 w-6 rounded flex items-center justify-center bg-slate-100 hover:bg-gray-200 text-text-color transition-all border"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
