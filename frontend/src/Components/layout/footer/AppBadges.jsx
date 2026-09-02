const AppBadges = () => (
  <div className="bg-gray-900 py-6 border-t border-gray-800">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        <p className="text-gray-400 mr-0 md:mr-4">
          Download our app for better experience
        </p>

        <div className="flex space-x-4">
          <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg flex items-center">
            <span className="mr-2">📱</span>
            <span>
              <div className="text-xs">Download on the</div>
              <div className="font-semibold">App Store</div>
            </span>
          </button>

          <button className="bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg flex items-center">
            <span className="mr-2">🤖</span>
            <span>
              <div className="text-xs">GET IT ON</div>
              <div className="font-semibold">Google Play</div>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AppBadges;
