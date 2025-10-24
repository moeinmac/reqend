import { useHttpStore } from "@/store/useHttpStore";
import { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useShallow } from "zustand/react/shallow";

import { Badge } from "@/components/ui/badge";

import prettyBytes from "pretty-bytes";
import { Spinner } from "../ui/spinner";

const Response: FC = () => {
  const { changeCardMode, response, isSubmitting } = useHttpStore(
    useShallow((state) => ({ changeCardMode: state.changeCardMode, response: state.response, isSubmitting: state.isSubmitting }))
  );

  console.log(response);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle className="flex items-center gap-3.5">
          {isSubmitting && <Spinner variant="circle" />}
          Response
        </CardTitle>
        <Button size={"sm"} variant={"outline"} onClick={() => changeCardMode("option")}>
          Request Options
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        {response && (
          <div>
            <div>
              <span>Size : {prettyBytes(response.size)}</span>
              <Badge variant={"default"}>{response.status}</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Response;
