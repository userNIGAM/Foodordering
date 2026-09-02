import { MessageCircle, Users } from "lucide-react";

const FoodConcierge = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="bg-gray-800 text-white rounded-2xl p-8 md:p-12 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h3 className="text-3xl font-bold mb-4">Personal Food Concierge</h3>
          <p className="text-gray-300 mb-6">
            Our unique service connects you with a food expert who can make recommendations based on your tastes, dietary needs, and even your mood!
          </p>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center">
              <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
              Personalized meal recommendations
            </li>

            <li className="flex items-center">
              <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
              One-on-one chat support
            </li>

            <li className="flex items-center">
              <span className="bg-orange-500 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                <span className="w-2 h-2 bg-white rounded-full"></span>
              </span>
              Custom meal planning assistance
            </li>
          </ul>

          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center">
            <MessageCircle size={20} className="mr-2" />
            Chat with our concierge
          </button>
        </div>

        <div className="md:w-1/2 relative">
          <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-6 transform rotate-2">
            <div className="bg-white text-gray-900 rounded-xl p-4 transform -rotate-2 shadow-lg">
              <div className="flex items-start mb-4">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  <Users size={20} />
                </div>

                <div>
                  <h4 className="font-semibold">Your Personal Food Advisor</h4>
                  <p className="text-sm text-gray-500">Typically replies in 5 minutes</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 mb-3">
                <p className="text-sm">
                  Hi there! Looking for something specific today or need recommendations?
                </p>
              </div>

              <div className="flex space-x-2">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-full transition-colors">
                  Quick suggestions
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-full transition-colors">
                  Dietary needs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FoodConcierge;
