import Icon from './Icon';
import { WHATSAPP_NUMBER } from '../lib/siteConfig';

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-40 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center justify-center"
  >
    <Icon name="whatsapp" className="w-7 h-7" />
  </a>
);

export default WhatsAppButton;
