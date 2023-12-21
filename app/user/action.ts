"use server";

import { db } from "../api/utils";

export async function getRecommandedProducts() {
  const products = await db.product.findMany({
    where: {
      isRecommended: true,
    },
    include: {
      images: true,
    },
  });

  return products;
}

export async function getRandomCategoryWithProducts() {
  const categories = await db.productCategory.findMany({
    include: {
      products: {
        include: {
          images: true,
        },
      },
    },
  });

  const 상품이3개이상인_카테고리 = categories.filter((item) => item.products.length > 2);
  if (상품이3개이상인_카테고리.length === 0) return null;

  const randomCategory =
    상품이3개이상인_카테고리[Math.floor(Math.random() * 상품이3개이상인_카테고리.length)];

  return randomCategory;
}

export async function getProductCategories() {
  const categories = await db.productCategory.findMany();

  return categories;
}
