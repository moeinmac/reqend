import { useHttpStore } from "@/store/useHttpStore";
import { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const Response: FC = () => {
  const changeCardMode = useHttpStore((state) => state.changeCardMode);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle>Response </CardTitle>
        <Button size={"sm"} variant={"outline"} onClick={() => changeCardMode("option")}>
          Request Options
        </Button>
      </CardHeader>
      <CardContent className="px-6"></CardContent>
    </Card>
  );
};

export default Response;
