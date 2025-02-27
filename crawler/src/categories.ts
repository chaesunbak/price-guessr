import { CATEGORIES as APP_CATEGORIES } from "../../src/constants/categories";

export interface Category {
  id: string;
  name: string;
}

// 메인 애플리케이션의 카테고리 목록 재사용
export const CATEGORIES = APP_CATEGORIES;

export function getRandomCategory(): Category {
  const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
  return CATEGORIES[randomIndex];
}
