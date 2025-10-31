import { useHttpStore } from "@/store/useHttpStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

import { Spinner } from "../ui/spinner";
import ResponseInfo from "./ResponseInfo";
import ResponseTabs from "./ResponseTab";

const Response: FC = () => {
  const { changeCardMode, response, isSubmitting, error } = useHttpStore(
    useShallow((state) => ({ changeCardMode: state.changeCardMode, response: state.response, isSubmitting: state.isSubmitting, error: state.error }))
  );

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
        <div>
          {response && <ResponseInfo size={response.size} statusCode={response.status} time={response.time} />}
          {error && <p>{error.message}</p>}
        </div>
        {response && <ResponseTabs headers={response.headers} data={response.data} />}
      </CardContent>
    </Card>
  );
};

export default Response;
