import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const FooterMain = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Brand */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-orange-500">Order</h3>
        <p className="text-gray-400 mb-6">
          Delivering delicious meals to your doorstep. Order from your favorite restaurants with just a few clicks.
        </p>

        <div className="flex space-x-4">
          <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"><FaFacebookF size={16} /></a>
          <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"><FaTwitter size={16} /></a>
          <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"><FaInstagram size={16} /></a>
          <a href="#" className="bg-gray-800 p-3 rounded-full hover:bg-orange-500 transition-colors"><FaLinkedinIn size={16} /></a>
        </div>
      </div>

      {/* Links */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
        <ul className="space-y-3">
          {["Home","Restaurants","About Us","How It Works","FAQs"].map((x,i)=>(<li key={i}><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">{x}</a></li>))}
        </ul>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Categories</h4>
        <ul className="space-y-3">
          {["Pizza","Burgers","Sushi","Pasta","Desserts"].map((x,i)=>(<li key={i}><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">{x}</a></li>))}
        </ul>
      </div>

      {/* Contact */}
      <div>
        <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
        <ul className="space-y-4">
          <li className="flex items-start"><FaMapMarkerAlt className="mt-1 mr-3 text-orange-500" /><span className="text-gray-400">Birtamode</span></li>
          <li className="flex items-center"><FaPhone className="mr-3 text-orange-500" /><span className="text-gray-400">+977 980000000</span></li>
          <li className="flex items-center"><FaEnvelope className="mr-3 text-orange-500" /><span className="text-gray-400">support@order.com</span></li>
        </ul>
      </div>

    </div>
  </div>
);

export default FooterMain;
