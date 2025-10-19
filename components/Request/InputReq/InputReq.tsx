import { cn } from "@/lib/utils";
import { useRequestStore } from "@/store/useRequestStore";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Input } from "../../ui/input";

const InputReq: FC = () => {
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isBlur, setIsBlur] = useState<boolean>(false);

  const { onChange, params, reqUrl } = useRequestStore(
    useShallow((state) => ({
      reqUrl: state.request?.url ?? "",
      onChange: state.onChangeUrl,
      params: state.request?.params ?? [],
    }))
  );

  const paramsInput = useMemo(() => {
    return params
      .filter((param) => param.selected)
      .reduce((acc, param, index) => {
        acc += index === 0 ? `?${param.key}=${param.value}` : `&${param.key}=${param.value}`;
        return acc;
      }, "");
  }, [params]);

  useEffect(() => {
    if (measureRef.current && inputRef.current) {
      const inputStyles = window.getComputedStyle(inputRef.current);
      measureRef.current.style.font = inputStyles.font;
      measureRef.current.style.fontSize = inputStyles.fontSize;
      measureRef.current.style.fontFamily = inputStyles.fontFamily;
      measureRef.current.style.fontWeight = inputStyles.fontWeight;
      measureRef.current.style.letterSpacing = inputStyles.letterSpacing;

      measureRef.current.textContent = reqUrl;
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [reqUrl]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        name="url"
        value={reqUrl}
        onChange={async (event) => await onChange(event.target.value)}
        placeholder={paramsInput.length === 0 ? "Enter URL or paste text" : ""}
        className="py-6 w-ful"
        ref={inputRef}
        onFocus={() => setIsBlur(false)}
        onBlur={() => setIsBlur(true)}
      />
      <span ref={measureRef} className="absolute invisible whitespace-pre" aria-hidden="true" />

      <span
        className={cn("absolute top-1/2 -translate-y-1/2  text-sm  pointer-events-none", isBlur ? "text-white" : "text-muted-foreground")}
        style={{
          left: `${textWidth + 14}px`,
        }}
      >
        {paramsInput}
      </span>
    </div>
  );
};

export default InputReq;
