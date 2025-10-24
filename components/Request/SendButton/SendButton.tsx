"use client";

import { Button } from "@/components/ui/button";
import { useHttpStore } from "@/store/useHttpStore";
import { FC } from "react";
const SendButton: FC = () => {
  const { sendRequest, isSubmitting } = useHttpStore();

  return (
    <Button
      onClick={async (e) => {
        e.preventDefault();
        await sendRequest();
      }}
      className="py-6 px-6 cursor-pointer"
      type="submit"
      disabled={isSubmitting}
    >
      Send
    </Button>
  );
};

export default SendButton;
