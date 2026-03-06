import { ElementType } from "react";

export interface Variants {
  name: string;
  price: number;
  mrp: number;
  stock: number;
  images: string[];
  specs: Record<string, string | number>;
}

export interface Specifications {
  key: string;
  value: string | number;
}

export interface Product {
  _id?: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  subCategory: string;

  price: number;
  mrp: number;
  discountPercent: number;
  stock: number;

  images: string[];
  thumbnail: string;

  variants: Variants[];

  specifications: Specifications[];

  features: string[];

  warranty: string;
  sku: string;

  rating: number;
  totalReviews: number;

  isPublished: boolean;
}

export interface PopularProductsType {
  fashion: Product[];
  electronics: Product[];
  bags: Product[];
  groceries: Product[];
  beauty: Product[];
  wellness: Product[];
  jewellery: Product[];
}

export type ProvidingDataItem = {
  icon: ElementType;
  title: string;
  des: string;
};

export type AutoBannerItem = {
  path: string;
};

export type ProductBannerItem = {
  name: string;
  image: string;
  details: string;
  description: string;
  productImg: string;
};

export type CatBannerImage = {
  path: string;
};

export type IconCardItem = {
  img: string;
  name: string;
  path: string;
};

export type HeroIconCardItem = {
  img: string;
  name: string;
  path: string;
};

export type BlogItem = {
  imgPath: string;
  title: string;
  content: string;
};

export type TabLabel =
  | "fashion"
  | "electronics"
  | "bags"
  | "groceries"
  | "beauty"
  | "wellness"
  | "jewellery";
