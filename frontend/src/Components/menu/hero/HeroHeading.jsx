import AnimatedSection from "../../AnimatedSection";
import { headingVariant, textVariant } from "./variants";

export default function HeroHeading() {
  return (
    <>
      <AnimatedSection variant={headingVariant}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Delicious Food,
          <span className="block text-yellow-400">Delivered Fast</span>
        </h1>
      </AnimatedSection>

      <AnimatedSection variant={textVariant}>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
          Fresh ingredients, authentic flavors, and lightning-fast delivery
          right to your door
        </p>
      </AnimatedSection>
    </>
  );
}
