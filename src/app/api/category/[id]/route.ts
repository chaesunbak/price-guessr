import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { Product } from "@/types/game";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const categoryId = (await params).id;
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      `${categoryId}.json`
    );

    try {
      // JSON 파일에서 데이터 읽기
      const fileData = await fs.readFile(filePath, "utf-8");
      const product = JSON.parse(fileData) as Product;

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            error: "상품 정보를 찾을 수 없습니다.",
          },
          { status: 404 }
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
      console.error(`파일 읽기 실패 (${categoryId}):`, error);
      return NextResponse.json(
        {
          success: false,
          error: "데이터 파일을 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Error: ${(error as Error).message}`,
      },
      { status: 500 }
    );
  }
}

// 서버 종료 시 브라우저 정리
process.on("SIGTERM", async () => {
  // 브라우저 정리 로직 필요
});
