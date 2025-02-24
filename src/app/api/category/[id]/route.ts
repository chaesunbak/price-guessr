import { NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Product } from "@/types/game";

chromium.setHeadlessMode = true;
chromium.setGraphicsMode = false;

async function fetchProduct(categoryId: string): Promise<Product | null> {
  console.log("카테고리 ID:", categoryId);

  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath:
        process.env.CHROME_EXECUTABLE_PATH ||
        (await chromium.executablePath(
          "/var/task/node_modules/@sparticuz/chromium/bin"
        )),
    });

    if (!browser) {
      throw new Error("브라우저 초기화 실패");
    }

    console.log("브라우저 초기화 성공");

    let page = null;
    try {
      page = await browser.newPage();

      await page.setDefaultNavigationTimeout(10000);
      await page.setDefaultTimeout(10000);

      // 리소스 최적화
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (
          req.resourceType() === "stylesheet" ||
          req.resourceType() === "font" ||
          // req.resourceType() === "image" ||
          req.resourceType() === "script"
        ) {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.setUserAgent(generateRandomUA());

      const response = await page.goto(
        `https://www.coupang.com/np/categories/${categoryId}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 10000,
        }
      );

      if (!response || !response.ok()) {
        throw new Error(`페이지 로드 실패: ${response?.status()}`);
      }

      const result = await page.evaluate(() => {
        const item = document.querySelector("li.baby-product");
        if (!item) return null;
        return {
          name: item.querySelector(".name")?.textContent?.trim() || "",
          price: item.querySelector(".price-value")?.textContent?.trim() || "",
          img: item.querySelector("img")?.src || "",
          url: item.querySelector("a")?.href || "",
        };
      });

      return result;
    } catch (error) {
      console.error("페이지 처리 중 에러:", error);
      throw error;
    } finally {
      if (page) {
        await page.close();
      }
    }
  } catch (error) {
    console.error("브라우저 초기화 실패:", error);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("브라우저 닫힘");
      } catch (e) {
        console.error("브라우저 닫기 실패:", e);
      }
    }
  }
}

// Function to generate a random user agent
const generateRandomUA = () => {
  // Array of random user agents
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  ];
  // Get a random index based on the length of the user agents array
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  // Return a random user-agent using the index above
  return userAgents[randomUAIndex];
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const categoryId = (await params).id;
    const product = await fetchProduct(categoryId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "상품 정보를 찾을 수 없습니다.",
        },
        {
          status: 404,
          headers: {
            "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("크롤링 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Error: ${(error as Error).message}`,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } finally {
  }
}

// 서버 종료 시 브라우저 정리
process.on("SIGTERM", async () => {
  // 브라우저 정리 로직 필요
});
