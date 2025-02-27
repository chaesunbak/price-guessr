import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { CATEGORIES } from "./categories";
import type { Product } from "../../src/types/game";

// 출력 디렉토리 설정 (프로젝트 루트의 public/data 폴더)
const OUTPUT_DIR = path.join(__dirname, "../..", "public", "data");

async function crawlCategory(
  categoryId: string,
  categoryName: string
): Promise<Product | null> {
  console.log(`크롤링 시작: ${categoryName} (${categoryId})`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // 리소스 최적화
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "stylesheet" ||
        req.resourceType() === "font"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(`https://www.coupang.com/np/categories/${categoryId}`, {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    // 상품 목록 추출
    const product = await page.evaluate(() => {
      const item = document.querySelector("li.baby-product");

      if (!item) return null;
      const name = item.querySelector(".name")?.textContent?.trim() || "";
      const priceText =
        item.querySelector(".price-value")?.textContent?.trim() || "0";
      const price = priceText.replace(/,/g, "");
      const img = item.querySelector("img")?.src || "";
      const url = item.querySelector("a")?.href || "";

      return { name, price, img, url };
    });

    if (!product) return null;

    return product;
  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    // 출력 디렉토리 생성
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // 모든 카테고리 크롤링
    for (const category of CATEGORIES) {
      try {
        const products = await crawlCategory(category.id, category.name);

        if (products) {
          // 카테고리별 파일 저장
          const filePath = path.join(OUTPUT_DIR, `${category.id}.json`);
          await fs.writeFile(filePath, JSON.stringify(products, null, 2));
          console.log(`파일 저장 완료: ${filePath}`);
        }
      } catch (error) {
        console.error(`카테고리 ${category.name} 크롤링 실패:`, error);
      }

      // 요청 간 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 카테고리 인덱스 파일 생성
    const categoryIndex = CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    await fs.writeFile(
      path.join(OUTPUT_DIR, "categories.json"),
      JSON.stringify(categoryIndex, null, 2)
    );

    console.log("모든 크롤링 작업 완료!");
  } catch (error) {
    console.error("크롤링 중 오류 발생:", error);
    process.exit(1);
  }
}

main();
