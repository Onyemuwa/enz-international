import { createContext, useContext, useState, useMemo, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [openModal, setOpenModal] = useState(null); // null | 'booking' | 'portal'

  const openBooking = useCallback(() => setOpenModal('booking'), []);
  const openPortal = useCallback(() => setOpenModal('portal'), []);
  const closeModal = useCallback(() => setOpenModal(null), []);

  const value = useMemo(
    () => ({ openModal, openBooking, openPortal, closeModal }),
    [openModal, openBooking, openPortal, closeModal]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
