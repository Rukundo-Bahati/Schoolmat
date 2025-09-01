export interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  required: boolean;
  description?: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

export const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Premium School Backpack",
    price: "15,000",
    image: "/premium-blue-school-backpack.png",
    required: true,
    rating: 5,
    reviews: 89,
    inStock: true,
    description:
      "Spacious and durable backpack with multiple compartments, padded straps, and water-resistant material. Perfect for carrying books, supplies, and electronics safely.",
  },
  {
    id: 2,
    name: "Scientific Calculator",
    price: "8,500",
    image: "/scientific-calculator.png",
    required: false,
    rating: 4,
    reviews: 156,
    inStock: true,
    description:
      "Advanced scientific calculator with 240+ functions, perfect for mathematics, physics, and engineering courses. Features a clear display and intuitive button layout.",
  },
  {
    id: 3,
    name: "Art Supply Kit",
    price: "12,000",
    image: "/complete-art-supply-kit.png",
    required: false,
    rating: 5,
    reviews: 73,
    inStock: true,
    description:
      "Complete art set including colored pencils, markers, paints, brushes, and drawing paper. Everything needed for creative expression and art classes.",
  },
  {
    id: 4,
    name: "Notebook Set (5 Pack)",
    price: "3,200",
    image: "/school-notebook-set.png",
    required: true,
    rating: 4,
    reviews: 234,
    inStock: true,
    description:
      "Set of 5 high-quality notebooks with lined pages, durable covers, and spiral binding. Perfect for note-taking across different subjects.",
  },
  {
    id: 5,
    name: "Geometry Set",
    price: "4,800",
    image: "/geometry-compass-ruler-set.png",
    required: true,
    rating: 4,
    reviews: 98,
    inStock: true,
    description:
      "Complete geometry set with compass, protractor, rulers, and triangles. Essential tools for mathematics and technical drawing classes.",
  },
  {
    id: 6,
    name: "Colored Pencils",
    price: "2,500",
    image: "/colored-pencils-set.png",
    required: false,
    rating: 4,
    reviews: 167,
    inStock: true,
    description:
      "Set of 24 vibrant colored pencils with smooth application and rich pigments. Perfect for art projects, diagrams, and creative assignments.",
  },
  {
    id: 7,
    name: "School Uniform",
    price: "18,000",
    image: "/school-uniform-shirt.png",
    required: true,
    rating: 4,
    reviews: 45,
    inStock: true,
    description:
      "High-quality school uniform shirt made from comfortable, breathable fabric. Available in standard school colors with proper fit and durability.",
  },
  {
    id: 8,
    name: "Water Bottle",
    price: "3,800",
    image: "/school-water-bottle.png",
    required: false,
    rating: 5,
    reviews: 112,
    inStock: true,
    description:
      "BPA-free water bottle with leak-proof design and easy-grip surface. Keeps drinks fresh and encourages healthy hydration throughout the school day.",
  },
  {
    id: 9,
    name: "Lunch Box",
    price: "5,200",
    image: "/colorful-school-lunch-box.png",
    required: false,
    rating: 4,
    reviews: 87,
    inStock: true,
    description:
      "Insulated lunch box with multiple compartments and easy-clean interior. Keeps food fresh and organized for healthy school meals.",
  },
  {
    id: 10,
    name: "Exercise Books",
    price: "1,800",
    image: "/school-exercise-books.png",
    required: true,
    rating: 4,
    reviews: 298,
    inStock: true,
    description:
      "Pack of exercise books with quality paper and durable covers. Perfect for homework, assignments, and classroom activities across all subjects.",
  },
  {
    id: 11,
    name: "Pencil Case",
    price: "2,800",
    image: "/school-pencil-case.png",
    required: false,
    rating: 4,
    reviews: 134,
    inStock: true,
    description:
      "Spacious pencil case with multiple compartments for organizing pens, pencils, erasers, and small supplies. Durable zipper and compact design.",
  },
  {
    id: 12,
    name: "Ruler Set",
    price: "1,500",
    image: "/placeholder.svg?height=250&width=250",
    required: true,
    rating: 4,
    reviews: 189,
    inStock: true,
    description:
      "Set of rulers in different lengths with clear markings in both metric and imperial units. Essential for mathematics and technical subjects.",
  },
];
