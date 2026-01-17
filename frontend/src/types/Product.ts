import type { JSX } from "react/jsx-runtime";

export interface Product {
  map(arg0: (p: unknown) => JSX.Element): import("react").ReactNode;
  _id: string;
  title: string;
  image: string;
  price: string;
}
