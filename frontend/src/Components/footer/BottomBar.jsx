const BottomBar = () => (
  <div className="bg-gray-950 py-6">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">
          © {new Date().getFullYear()} Order. All rights reserved.
        </p>

        <div className="flex space-x-6">
          {["Privacy Policy","Terms of Service","Refund Policy"].map((x,i)=>(
            <a key={i} href="#" className="text-gray-500 hover:text-orange-500 text-sm transition-colors">
              {x}
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BottomBar;
