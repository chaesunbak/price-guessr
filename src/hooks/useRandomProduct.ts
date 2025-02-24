import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/game";
import { getRandomCategory } from "@/constants/categories";

interface UseRandomProductProps {
  round: number;
}

interface UseRandomProductReturn {
  product: Product | null;
  isLoading: boolean;
  error: Error | null;
}

export function useRandomProduct({
  round,
}: UseRandomProductProps): UseRandomProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [nextProduct, setNextProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef(false);
  const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const usedCategoriesRef = useRef<string[]>([]);

  // round가 1로 돌아갈 때 초기화
  useEffect(() => {
    if (round === 1) {
      setProduct(null);
      setNextProduct(null);
      setError(null);
      isFetchingRef.current = false;
      usedCategoriesRef.current = [];

      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
        prefetchTimeoutRef.current = null;
      }
    }
  }, [round]);

  // 상품 가져오기 함수
  const fetchProduct = async () => {
    if (isFetchingRef.current) return null;

    try {
      isFetchingRef.current = true;
      let category;

      // 이미 사용한 카테고리가 10개면 초기화
      if (usedCategoriesRef.current.length >= 10) {
        usedCategoriesRef.current = [];
      }

      // 아직 사용하지 않은 카테고리 찾기
      do {
        category = getRandomCategory();
      } while (usedCategoriesRef.current.includes(category.id));

      // 사용한 카테고리 기록
      usedCategoriesRef.current.push(category.id);
      console.log(`라운드 ${round}: ${category.name} 카테고리 선택됨`);

      const response = await fetch(`/api/category/${category.id}`);
      // const response = await fetch(`/api/category/${category.id}`, {
      //   cache: "force-cache",
      //   next: { revalidate: 300 }, // 5분마다 재검증
      // });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "상품을 가져오는데 실패했습니다.");
      }

      if (data.success && data.data) {
        return {
          ...data.data,
          category: category.name,
        };
      } else {
        throw new Error("상품 데이터가 올바르지 않습니다.");
      }
    } finally {
      isFetchingRef.current = false;
    }
  };

  // 현재 라운드 상품 설정
  useEffect(() => {
    let isSubscribed = true;

    const loadProduct = async () => {
      if (nextProduct && isSubscribed) {
        setProduct(nextProduct);
        setNextProduct(null);
        setIsLoading(false);
      } else {
        setIsLoading(true);
        try {
          const newProduct = await fetchProduct();
          if (isSubscribed && newProduct) {
            setProduct(newProduct);
          }
        } catch (err) {
          if (isSubscribed) {
            setError(
              err instanceof Error
                ? err
                : new Error("알 수 없는 오류가 발생했습니다.")
            );
            console.error("상품 정보를 가져오는데 실패했습니다:", err);
          }
        } finally {
          if (isSubscribed) {
            setIsLoading(false);
          }
        }
      }
    };

    loadProduct();

    return () => {
      isSubscribed = false;
    };
  }, [round]);

  // 다음 상품 미리 가져오기
  useEffect(() => {
    const prefetchNext = async () => {
      // 이미 다음 상품이 있거나 로딩 중이면 스킵
      if (nextProduct || isLoading || isFetchingRef.current) return;

      try {
        console.log("다음 상품 프리페칭 시작");
        const newProduct = await fetchProduct();
        if (newProduct) {
          console.log("다음 상품 프리페칭 성공");
          setNextProduct(newProduct);
        }
      } catch (err) {
        console.error("다음 상품 미리 가져오기 실패:", err);
      }
    };

    // 현재 상품이 설정되면 일정 시간 후 다음 상품 가져오기
    if (product && !nextProduct && !isLoading) {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }

      prefetchTimeoutRef.current = setTimeout(() => {
        prefetchNext();
      }, 1000);
    }

    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, [product, nextProduct, isLoading]);

  return {
    product,
    isLoading,
    error,
  };
}
