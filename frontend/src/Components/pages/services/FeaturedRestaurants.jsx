// FeaturedRestaurants.jsx
const FeaturedRestaurants = () => {
  const partners = [
    { name: "Bella Italia", logo: "/images/restaurants/bella.png" },
    { name: "Sushi House", logo: "/images/restaurants/sushi.png" },
    { name: "Taco Fiesta", logo: "/images/restaurants/taco.png" },
    { name: "GreenBowl", logo: "/images/restaurants/greenbowl.png" },
  ];

  return (
    <div className="mt-20">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Our Restaurant Partners
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {partners.map((partner, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="w-20 h-20 object-contain mb-4"
            />
            <p className="text-gray-700 font-medium">{partner.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedRestaurants;
