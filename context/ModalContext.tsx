"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ModalContextType = {
  isOpen: boolean;
  content: ReactNode;
  openModal: (content?: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openModal = (modalContent?: ReactNode) => {
    setContent(modalContent || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}
