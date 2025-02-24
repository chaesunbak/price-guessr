// 한글 단위 변환 함수
export const convertToKoreanUnit = (price: number): string => {
  if (!price) return "";

  if (price >= 100000000) {
    // 1억 이상
    return `${Math.floor(price / 100000000)}억${
      price % 100000000 > 0
        ? " " + Math.floor((price % 100000000) / 10000) + "만"
        : ""
    }`;
  } else if (price >= 10000) {
    // 1만 이상
    return `${Math.floor(price / 10000)}만${
      price % 10000 > 0 ? " " + (price % 10000) : ""
    }`;
  } else {
    return `${price}`;
  }
};
