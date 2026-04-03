import { ModalProps } from "@constants/interfaces";
import { useEffect, useRef } from "react";

export default function Modal({ title, onClose, children, open }: ModalProps) {
  const ref = useRef<null | HTMLDialogElement>(null);

  // TODO: Use this to replace modals.

  useEffect(() => {
    if (open) {
      return ref.current?.showModal();
    }

    return ref.current?.close();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="left-0 right-0 top-0 bottom-0 m-auto backdrop:bg-black/70"
    >
      <div className="flex items-center justify-start w-full">
        <button type="button" onClick={onClose}>
          x
        </button>

        <div className="flex items-center justify-center w-full me-4">
          {title}
        </div>
      </div>
      {children}
    </dialog>
  );
}
