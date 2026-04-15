const productImage = "https://gigatron.rs/_next/image?url=https%3A%2F%2Fbackend.gigatron.rs%2Fmedia%2Fcatalog%2Fproduct%2Fcache%2Fd62e1a0582bf7257bddc609f302ce89c%2F8%2F6%2F8680096106743.jpg&w=2048&q=75";

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  brand: string;
  color: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "GRUNDIG Televizor 50 GFU 7800B",
    price: 44999,
    oldPrice: 54999,
    image: productImage,
    brand: "Grundig",
    color: "Crna",
    rating: 4.5,
    reviews: 12
  },
  {
    id: 2,
    name: "SAMSUNG Televizor 55 QLED Q60A",
    price: 89999,
    oldPrice: 104999,
    image: productImage,
    brand: "Samsung",
    color: "Siva",
    rating: 4.8,
    reviews: 8
  },
  {
    id: 3,
    name: "APPLE iPhone 15 Pro Max 256GB",
    price: 184999,
    image: productImage,
    brand: "Apple",
    color: "Titanijum",
    rating: 4.9,
    reviews: 25
  },
  {
    id: 4,
    name: "LG Televizor 65 OLED C3",
    price: 219999,
    oldPrice: 259999,
    image: productImage,
    brand: "LG",
    color: "Crna",
    rating: 4.9,
    reviews: 15
  },
  {
    id: 5,
    name: "SONY PlayStation 5 Slim",
    price: 64999,
    image: productImage,
    brand: "Sony",
    color: "Bela",
    rating: 4.7,
    reviews: 120
  },
  {
    id: 6,
    name: "DELL Laptop Latitude 5540",
    price: 124999,
    image: productImage,
    brand: "Dell",
    color: "Siva",
    rating: 4.4,
    reviews: 10
  },
  {
    id: 7,
    name: "XIAOMI Redmi Note 13 Pro+",
    price: 49999,
    oldPrice: 59999,
    image: productImage,
    brand: "Xiaomi",
    color: "Ljubičasta",
    rating: 4.6,
    reviews: 45
  },
  {
    id: 8,
    name: "ASUS ROG Zephyrus G14",
    price: 249999,
    image: productImage,
    brand: "Asus",
    color: "Crna",
    rating: 4.8,
    reviews: 30
  }
];
