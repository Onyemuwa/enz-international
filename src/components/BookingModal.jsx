import Modal from './Modal';
import BookingForm from './BookingForm';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';

const BookingModal = () => {
  const { t } = useLanguage();
  const { openModal, closeModal } = useModal();
  if (openModal !== 'booking') return null;
  return (
    <Modal onClose={closeModal} title={t('bookingTitle')}>
      <BookingForm onSuccess={() => {}} />
    </Modal>
  );
};

export default BookingModal;
