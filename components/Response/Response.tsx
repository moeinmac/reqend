import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

interface ResponseProps {
  onFlipHandler: () => void;
}

const Response: FC<ResponseProps> = ({ onFlipHandler }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle>Response </CardTitle>
        <Button size={"sm"} variant={"outline"} onClick={onFlipHandler}>
          Request Options
        </Button>
      </CardHeader>
      <CardContent className="px-6"></CardContent>
    </Card>
  );
};

export default Response;
