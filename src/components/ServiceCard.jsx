import Icon from './Icon';

const ServiceCard = ({ title, desc, icon }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
    <div className="mb-4">
      <Icon name={icon} className="w-10 h-10 text-gold" />
    </div>
    <h3 className="text-xl font-bold text-navy">{title}</h3>
    <p className="text-gray-600 text-sm mt-2 leading-relaxed">{desc}</p>
  </div>
);

export default ServiceCard;
