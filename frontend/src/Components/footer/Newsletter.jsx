const Newsletter = () => (
  <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="mb-6 md:mb-0">
        <h4 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h4>
        <p className="text-gray-400">Get the latest updates and special offers</p>
      </div>

      <div className="flex w-full md:w-auto">
        <input
          type="email"
          placeholder="Your email address"
          className="bg-gray-800 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
        />
        <button className="bg-orange-500 text-white font-medium px-6 py-3 rounded-r-lg hover:bg-orange-600 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  </div>
);

export default Newsletter;
