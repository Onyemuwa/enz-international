import { useState } from 'react';
import Modal from './Modal';
import PortalLoginForm from './PortalLoginForm';
import { useLanguage } from '../i18n/LanguageContext';
import { useModal } from '../context/ModalContext';

const PortalModal = () => {
  const { t } = useLanguage();
  const { openModal, closeModal } = useModal();
  const [loggedInUser, setLoggedInUser] = useState(null);

  if (openModal !== 'portal') return null;

  const handleClose = () => {
    closeModal();
    setLoggedInUser(null);
  };

  return (
    <Modal onClose={handleClose} title={t('portalTitle')}>
      {loggedInUser ? (
        <div className="text-center py-6">
          <div className="text-4xl mb-4" aria-hidden="true">✅</div>
          <p className="text-lg font-semibold text-navy">{t('portalMock')}</p>
          <p className="text-sm text-gray-500 mt-2">{t('portalLoggedInDesc')}</p>
          <button
            onClick={handleClose}
            className="mt-6 text-sm font-medium text-navy border border-gray-300 rounded-full px-5 py-2 hover:bg-gray-50 transition"
          >
            {t('portalLogout')}
          </button>
        </div>
      ) : (
        <PortalLoginForm onSuccess={(result) => setLoggedInUser(result.user)} />
      )}
    </Modal>
  );
};

export default PortalModal;
