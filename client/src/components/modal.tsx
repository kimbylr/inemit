import React, { FC, useEffect, useRef, useState } from 'react';
import { Icon } from '../elements/icon';

type Props = {
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'lg';
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

  // Lock background scrolling (intricately, because iOS needs body position fixed to allow scrolling elswhere)
  useEffect(() => {
    const scrollOffset = window.scrollY;
    document.body.classList.add('fixed');
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('xs:static');

    return () => {
      document.body.classList.remove('fixed');
      document.body.classList.remove('overflow-hidden');
      window.scrollTo({ top: scrollOffset, behavior: 'auto' });
    };
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

    const onTabListener = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') {
        return;
      }

      if (e.shiftKey && document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
      if (!e.shiftKey && document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
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
        className="fixed z-30 inset-0 grid place-items-center xs:p-4 max-h-screen"
        onClick={onClose}
      >
        {/* modal panel */}
        <div
          className={`relative bg-grey-98 overflow-hidden xs:rounded-lg shadow-modal transform transition-all w-full ${
            width === 'sm' ? 'xs:max-w-sm' : 'xs:max-w-lg'
          } h-full max-h-screen xs:h-auto xs:max-h-[calc(100vh-2rem)] flex flex-col`}
          ref={modalRef}
          onClick={(event) => event.stopPropagation()} // prevent propagation to parent div with close handler
        >
          <button
            className="!absolute right-4 w-6 h-6 text-grey-25 dotted-focus dotted-focus-dark"
            style={{ top: 'max(env(safe-area-inset-top), 1rem)' }}
            onClick={onClose}
            type="button"
          >
            <Icon type="closeCross" />
          </button>

          <h2
            id="modal-title"
            className="p-4 pb-5 xs:pl-6 sm:pl-8 text-grey-25 bg-grey-85 uppercase text-xs font-bold xs:rounded-t-lg flex-shrink-0"
            style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
          >
            {title}
          </h2>

          {/* content */}
          <div className="p-4 xs:p-6 sm:p-8 bg-grey-98 rounded-t-lg relative -top-2 overflow-y-auto -mb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
