import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import products from "../components/Products";
const Carousel = () => {
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
    ],
  };
  return (
    <section className="px-6 py-10 bg-white">
      <h3 className="text-2xl font-bold mb-6 text-center">Featured Products</h3>
      <Slider {...carouselSettings}>
        {products.slice(0, 6).map((item) => (
          <div key={item.id} className="px-4">
            <div className="bg-white rounded shadow-md overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4">
                <h4 className="font-semibold text-lg">{item.name}</h4>
                <p className="text-green-700">{item.price}</p>
                <button className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Carousel;
