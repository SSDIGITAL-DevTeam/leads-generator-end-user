"use client";

import { useCallback, useState } from "react";

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  return {
    isOpen,
    open,
    close,
    toggle
  };
};

export type UseModalReturn = ReturnType<typeof useModal>;
