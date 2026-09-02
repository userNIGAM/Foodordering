// ServiceCard.jsx
const ServiceCard = ({ service, index, isVisible, onMouseEnter }) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={onMouseEnter}
    >
      <div
        className={`inline-flex items-center justify-center p-3 rounded-2xl mb-4 ${service.color}`}
      >
        {service.icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        {service.title}
      </h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <ul className="space-y-2 mb-4">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center text-gray-700">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
            {feature}
          </li>
        ))}
      </ul>
      <p className="text-sm font-medium text-gray-500">{service.stats}</p>
    </div>
  );
};

export default ServiceCard;
