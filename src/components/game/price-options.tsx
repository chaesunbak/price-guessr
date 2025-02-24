import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { convertToKoreanUnit } from "@/lib/formats";

interface PriceOptionsProps {
  onSubmit: (price: number) => void;
}

export function PriceOptions({ onSubmit }: PriceOptionsProps) {
  const [inputPrice, setInputPrice] = useState("");
  const [koreanUnit, setKoreanUnit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(inputPrice.replace(/,/g, ""));
    if (!isNaN(numericPrice) && numericPrice > 0) {
      onSubmit(numericPrice);
      setInputPrice("");
      setKoreanUnit("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");
    if (value) {
      const numericValue = Number(value);
      setInputPrice(numericValue.toLocaleString());
      setKoreanUnit(convertToKoreanUnit(numericValue));
    } else {
      setInputPrice("");
      setKoreanUnit("");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2">
          <div className="relative w-full">
            <Input
              type="text"
              value={inputPrice}
              onChange={handleInputChange}
              placeholder="예상 가격을 입력해주세요"
              className="text-right pr-12"
              autoFocus
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              {koreanUnit ? `(${koreanUnit}원)` : ""}
            </span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              원
            </span>
          </div>
        </div>
        <Button type="submit" variant="default" className="w-full">
          확인
        </Button>
      </form>
    </div>
  );
}
