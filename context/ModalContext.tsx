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
  title: string;
  subTitle: string;
  openModal: (
    title?: string,
    subTitle?: string,
    content?: ReactNode,
    parentRefetch?: () => void,
  ) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [title, setTitle] = useState<string>("");
  const [subTitle, setSubTitle] = useState<string>("");
  const [parentRefetch, setParentRefetch] = useState<(() => void) | null>(null);

  const openModal = (
    title?: string,
    subTitle?: string,
    modalContent?: ReactNode,
    parentRefetch?: () => void,
  ) => {
    setContent(modalContent || null);
    setTitle(title || "");
    setSubTitle(subTitle || "");
    setIsOpen(true);
    if (parentRefetch) {
      setParentRefetch(() => parentRefetch);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
    setTitle("");
    setSubTitle("");
    setParentRefetch(null);
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
    <ModalContext.Provider
      value={{
        isOpen,
        title,
        subTitle,
        content,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used inside ModalProvider");
  return context;
}
