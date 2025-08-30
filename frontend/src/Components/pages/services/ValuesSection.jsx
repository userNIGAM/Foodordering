// ValuesSection.jsx
import { Star } from "lucide-react";

const ValuesSection = ({ values }) => {
  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 md:p-12 mb-16">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Our Values
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((value, index) => (
          <div key={index} className="text-center">
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
              <Star className="text-orange-500" size={28} />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              {value.title}
            </h4>
            <p className="text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValuesSection;
