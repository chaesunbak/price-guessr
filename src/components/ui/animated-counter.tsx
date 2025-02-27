"use client";

import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatFn?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  className = "",
  prefix = "",
  suffix = "",
  duration = 0.5,
  formatFn = (val) => val.toString(),
}: AnimatedCounterProps) {
  const prevValueRef = useRef(value);
  const motionValue = useMotionValue(prevValueRef.current);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
    duration: duration * 1000,
  });

  const displayValue = useTransform(springValue, (latest) => {
    return formatFn(Math.round(latest));
  });

  useEffect(() => {
    const prevValue = prevValueRef.current;
    const difference = value - prevValue;

    // 값이 변경되었을 때만 애니메이션 실행
    if (difference !== 0) {
      prevValueRef.current = value;
      motionValue.set(value);
    }
  }, [value, motionValue]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        {prefix && <span>{prefix}</span>}
        <motion.span
          className="inline-block text-lg"
          style={{
            scale: useSpring(
              useTransform(
                springValue,
                [prevValueRef.current, value],
                [1, value > prevValueRef.current ? 1.2 : 0.8],
              ),
              { duration: duration * 1000 },
            ),
          }}
        >
          {displayValue}
        </motion.span>
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
}
