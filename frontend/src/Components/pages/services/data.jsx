// data.js
import {
  Truck,
  ChefHat,
  Shield,
  Clock,
  Star,
  Heart,
  Users,
} from "lucide-react";

export const servicesData = [
  {
    id: 1,
    icon: <Truck size={36} />,
    title: "Fast Delivery",
    description:
      "Get your favorite meals delivered in under 30 minutes with our optimized delivery routes.",
    features: [
      "Real-time tracking",
      "30-minutes guarantee",
      "Contactless delivery",
    ],
    stats: "98% on-time delivery",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    icon: <ChefHat size={36} />,
    title: "Recipe Inspiration",
    description:
      "Discover new recipes and get ingredients delivered to your door within hours.",
    features: [
      "Chef-curated recipes",
      "One-click ingredient ordering",
      "Video tutorials",
    ],
    stats: "500+ recipes available",
    color: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    icon: <Shield size={36} />,
    title: "Quality Guarantee",
    description:
      "We partner with local restaurants that maintain the highest food safety standards.",
    features: [
      "Verified kitchens",
      "Fresh ingredients only",
      "Satisfaction guarantee",
    ],
    stats: "4.9/5 satisfaction rate",
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 4,
    icon: <Users size={36} />,
    title: "Group Ordering",
    description:
      "Simplify meals for groups with our easy ordering system and split billing.",
    features: [
      "Split payment options",
      "Order customization",
      "Office catering",
    ],
    stats: "10,000+ group orders monthly",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 5,
    icon: <Heart size={36} />,
    title: "Health Conscious",
    description:
      "Find meals tailored to your dietary preferences and nutritional goals.",
    features: [
      "Calorie-counted options",
      "Allergy filters",
      "Nutritionist approved",
    ],
    stats: "15 dietary categories",
    color: "bg-rose-100 text-rose-600",
  },
  {
    id: 6,
    icon: <Clock size={36} />,
    title: "Meal Planning",
    description:
      "Plan your weekly meals and get everything delivered on your schedule.",
    features: [
      "Weekly meal plans",
      "Automated recurring orders",
      "Flexible scheduling",
    ],
    stats: "Save 5+ hours weekly",
    color: "bg-cyan-100 text-cyan-600",
  },
];

export const valuesData = [
  {
    title: "Supporting Local",
    description:
      "85% of our restaurant partners are local businesses, not chains.",
  },
  {
    title: "Eco-Friendly Packaging",
    description:
      "We use 100% biodegradable packaging and offset our delivery emissions.",
  },
  {
    title: "Community First",
    description:
      "We donate meals to local shelters for every 50 orders placed.",
  },
];
