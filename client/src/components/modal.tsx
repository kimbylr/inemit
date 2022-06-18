import React, { FC, useEffect, useRef } from 'react';
import { Icon } from '../elements/icon';

import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock';

type Props = {
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md';
  onClose: () => void;
};

type FOCUSABLE_ELEMENTS =
  | HTMLButtonElement
  | HTMLLinkElement
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;
const focusableElements =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export const Modal: FC<Props> = ({ onClose, title, children, width = 'sm' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Lock background scrolling
  useEffect(() => {
    modalRef.current &&
      disableBodyScroll(modalRef.current, { reserveScrollBarGap: true });
    return clearAllBodyScrollLocks;
  }, []);

  // Close on pressing escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEsc, true);
    return () => document.removeEventListener('keydown', handleEsc, true);
  }, []);

  // Manage focus (tab)
  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    const focusableContent =
      modalRef.current.querySelectorAll<FOCUSABLE_ELEMENTS>(focusableElements);

    if (focusableContent.length === 0) {
      return;
    }

    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    const onTabListener = (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        event.shiftKey &&
        document.activeElement === firstFocusableElement
      ) {
        lastFocusableElement.focus();
        event.preventDefault();
      } else if (event.key === 'Tab' && document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', onTabListener);
    return () => document.removeEventListener('keydown', onTabListener);
  }, []);

  return (
    <div
      className="relative z-30"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={(event) => event.stopPropagation()}
    >
      {/* background */}
      <div className="fixed inset-0 bg-[#000] bg-opacity-50 transition-opacity" />

      <div
        className="fixed z-30 inset-0 overflow-y-auto grid place-items-center xs:py-4"
        onClick={onClose}
      >
        {/* modal panel */}
        <div
          className={`relative bg-grey-98 xs:rounded-lg shadow-modal transform transition-all w-full ${
            width === 'sm' ? 'xs:max-w-sm' : 'xs:max-w-xl'
          } h-full xs:h-auto`}
          ref={modalRef}
          onClick={(event) => event.stopPropagation()} // prevent propagation to parent div with close handler
        >
          <button
            className="absolute top-4 right-4 w-6 h-6 text-grey-25"
            onClick={onClose}
          >
            <Icon type="closeCross" />
          </button>

          <h2
            id="modal-title"
            className="p-4 pb-5 xs:pl-6 sm:pl-8 text-grey-25 bg-grey-85 uppercase text-xs font-bold xs:rounded-t-lg"
          >
            {title}
          </h2>

          {/* content */}
          <div className="p-4 xs:p-6 sm:p-8 bg-grey-98 rounded-t-lg relative -top-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
