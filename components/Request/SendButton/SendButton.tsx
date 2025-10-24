"use client";

import { Button } from "@/components/ui/button";
import { FC } from "react";
const SendButton: FC = () => {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
      }}
      className="py-6 px-6 cursor-pointer"
      type="submit"
    >
      Send
    </Button>
  );
};

export default SendButton;
