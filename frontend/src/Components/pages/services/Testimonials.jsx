// Testimonials.jsx
const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah M.",
      text: "Order made my weeknights stress-free! Meals are always fresh and on time.",
      image: "/images/customer1.jpg",
    },
    {
      name: "James K.",
      text: "I love the group ordering feature for office lunches. Super convenient!",
      image: "/images/customer2.jpg",
    },
    {
      name: "Emily R.",
      text: "The recipe inspiration section is my favorite. Cooking at home feels easy now!",
      image: "/images/customer3.jpg",
    },
  ];

  return (
    <div className="mt-20">
      <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
        What Our Customers Say
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((review, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center text-center hover:shadow-lg transition"
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-16 h-16 rounded-full mb-4"
            />
            <p className="text-gray-600 mb-4">"{review.text}"</p>
            <h4 className="font-semibold text-gray-900">{review.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
