const ServiceCard = ({ service, isVisible, delay }) => (
  <div
    className={`bg-white text-gray-900 rounded-xl p-6 shadow-lg transition-all duration-700 transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex justify-center mb-4 text-orange-500">{service.icon}</div>
    <h3 className="text-xl font-semibold text-center mb-2">{service.title}</h3>
    <p className="text-gray-600 text-center">{service.description}</p>
  </div>
);

export default ServiceCard;
