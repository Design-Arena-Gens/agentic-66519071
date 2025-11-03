import BrandCarousel from "../components/BrandCarousel";

const brands = [
  {
    id: "aurora",
    name: "Aurora Apparel",
    logo: "/brands/aurora.svg",
    description:
      "Eco-friendly athleisure crafted with recycled materials and bold color stories."
  },
  {
    id: "lumen",
    name: "Lumen Lighting",
    logo: "/brands/lumen.svg",
    description:
      "Minimalist lighting solutions that blend ambient warmth with smart-home control."
  },
  {
    id: "ember",
    name: "Ember Kitchen",
    logo: "/brands/ember.svg",
    description:
      "Premium cookware engineered for chefs, perfected for modern home kitchens."
  },
  {
    id: "northwind",
    name: "Northwind Gear",
    logo: "/brands/northwind.svg",
    description:
      "Technical outerwear built to tackle alpine expeditions and urban adventures alike."
  },
  {
    id: "solis",
    name: "Solis Solar",
    logo: "/brands/solis.svg",
    description:
      "Solar solutions that make clean energy accessible for homes and businesses."
  },
  {
    id: "cascade",
    name: "Cascade Living",
    logo: "/brands/cascade.svg",
    description:
      "Furniture collections inspired by biophilic design and sustainable wood sourcing."
  },
  {
    id: "flux",
    name: "Flux Electronics",
    logo: "/brands/flux.svg",
    description:
      "Cutting-edge consumer electronics merging modular design with premium finishes."
  },
  {
    id: "terra",
    name: "Terra Botanics",
    logo: "/brands/terra.svg",
    description:
      "Botanical skincare powered by regenerative farming and cold-press extraction."
  }
];

export default function Page() {
  return (
    <main className="page">
      <div className="page__intro">
        <h1>Trusted by leading brands</h1>
        <p>
          Showcase a rotating roster of partners with hover-ready insights,
          keyboard controls, and adaptive layouts for every screen size.
        </p>
      </div>
      <BrandCarousel brands={brands} />
    </main>
  );
}
