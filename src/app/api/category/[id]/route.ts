import { NextResponse } from "next/server";
import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Product } from "@/types/game";

// 메모리 사용량 로깅 함수
function logMemoryUsage(label: string) {
  const used = process.memoryUsage();
  console.log(`[${label}] Memory Usage:`);
  console.log(`  RSS: ${Math.round(used.rss / 1024 / 1024)}MB`); // Resident Set Size
  console.log(`  Heap Total: ${Math.round(used.heapTotal / 1024 / 1024)}MB`);
  console.log(`  Heap Used: ${Math.round(used.heapUsed / 1024 / 1024)}MB`);
  console.log(`  External: ${Math.round(used.external / 1024 / 1024)}MB`);
}

// 브라우저 및 요청 큐 관리자
class BrowserManager {
  private static instance: BrowserManager;
  private browser: Browser | null = null;
  private requestQueue: Array<{
    categoryId: string;
    resolve: (value: Product | null) => void;
    reject: (reason: Error) => void;
  }> = [];
  private isProcessing = false;

  private constructor() {}

  static getInstance(): BrowserManager {
    if (!this.instance) {
      this.instance = new BrowserManager();
    }
    return this.instance;
  }

  private async initBrowser() {
    if (!this.browser) {
      console.log("브라우저 초기화...");
      this.browser = await puppeteer.launch({
        args: [
          ...chromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
          "--disable-dev-tools",
          "--no-first-run",
          "--headless=new",
          "--hide-scrollbars",
          "--mute-audio",
          "--disable-infobars",
          "--window-size=1920,1080",
        ],
        defaultViewport: {
          width: 1920,
          height: 1080,
          deviceScaleFactor: 1,
        },
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });

      this.browser.on("disconnected", () => {
        console.log("브라우저 연결 해제됨");
        this.browser = null;
      });

      // 브라우저가 준비되었는지 확인
      const pages = await this.browser.pages();
      if (pages.length === 0) {
        await this.browser.newPage();
      }

      console.log("브라우저 초기화 완료");
    }
    return this.browser;
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    let browser = null;

    try {
      browser = await this.initBrowser();
      if (!browser) {
        throw new Error("브라우저 초기화 실패");
      }

      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift()!;
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
              req.resourceType() === "image" ||
              req.resourceType() === "script"
            ) {
              req.abort();
            } else {
              req.continue();
            }
          });

          await page.setUserAgent(generateRandomUA());

          const response = await page.goto(
            `https://www.coupang.com/np/categories/${request.categoryId}`,
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
              price:
                item.querySelector(".price-value")?.textContent?.trim() || "",
              img: item.querySelector("img")?.src || "",
              url: item.querySelector("a")?.href || "",
            };
          });

          request.resolve(result);
        } catch (error) {
          console.error("페이지 처리 중 에러:", error);
          request.reject(
            error instanceof Error ? error : new Error(String(error))
          );
        } finally {
          if (page) {
            try {
              await page.close();
            } catch (e) {
              console.error("페이지 닫기 실패:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("큐 처리 중 치명적 에러:", error);
    } finally {
      this.isProcessing = false;
      if (browser) {
        try {
          await browser.close();
        } catch (e) {
          console.error("브라우저 닫기 실패:", e);
        }
      }
    }
  }

  async fetchProduct(categoryId: string): Promise<Product | null> {
    console.log("상품 가져오기 요청:", categoryId);
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ categoryId, resolve, reject });
      console.log("큐에 요청 추가됨:", {
        queueLength: this.requestQueue.length,
      });
      this.processQueue().catch((err) => {
        console.error("processQueue 실행 중 에러:", err);
        reject(err);
      });
    });
  }

  async cleanup() {
    if (this.browser) {
      console.log("브라우저 정리 시작");
      logMemoryUsage("Before Browser Cleanup");
      await this.browser.close();
      this.browser = null;
      console.log("브라우저 정리 완료");
      logMemoryUsage("After Browser Cleanup");
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
  logMemoryUsage("Route Handler Start");
  try {
    const categoryId = (await params).id;
    const browserManager = BrowserManager.getInstance();
    const product = await browserManager.fetchProduct(categoryId);

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
    logMemoryUsage("Route Handler Error");
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
    logMemoryUsage("Route Handler End");
  }
}

// 서버 종료 시 브라우저 정리
process.on("SIGTERM", async () => {
  await BrowserManager.getInstance().cleanup();
});
