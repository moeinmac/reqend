"use client";

import { Button } from "@/components/ui/button";
import { requestHandler } from "@/lib/requestHandler";
import { useRequestStore } from "@/store/useRequestStore";
import { useFormStatus } from "react-dom";
const SendButton = () => {
  const request = useRequestStore((state) => state.request);
  if (!request) return;

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        requestHandler(request);
      }}
      className="py-6 px-6 cursor-pointer"
      type="submit"
    >
      Send
    </Button>
  );
};

export default SendButton;
