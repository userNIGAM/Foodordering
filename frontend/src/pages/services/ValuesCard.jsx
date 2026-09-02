const ValuesCard = ({ value, isVisible }) => (
  <div
    className={`transition-all duration-700 transform ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
  >
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {value.title}
      </h3>
      <p className="text-slate-600">{value.description}</p>
    </div>
  </div>
);

export default ValuesCard;
