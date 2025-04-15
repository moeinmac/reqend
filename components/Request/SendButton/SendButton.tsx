"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
const SendButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="py-6" type="submit">
      {pending ? "Wait" : "Send"}
    </Button>
  );
};

export default SendButton;
