import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHttpStore } from "@/store/useHttpStore";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";
import Authentication from "./Authentication/Authentication";
import Body from "./Body/Body";
import Headers from "./Headers/Headers";
import Params from "./Params/Params";

const Options: FC = () => {
  const { changeCardMode, response } = useHttpStore(useShallow((state) => ({ changeCardMode: state.changeCardMode, response: state.response })));

  const requestMethod = useRequestStore((state) => state.request?.method);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between w-full">
        <CardTitle>Request Options</CardTitle>
        <Button disabled={!response} size={"sm"} variant={"outline"} onClick={() => changeCardMode("response")}>
          Response
        </Button>
      </CardHeader>
      <CardContent className="px-6">
        <Tabs defaultValue="params">
          <TabsList className="mb-2">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger disabled={requestMethod === "get"} value="body">
              Body
            </TabsTrigger>
          </TabsList>
          <TabsContent value="params">
            <Params />
          </TabsContent>
          <TabsContent value="authentication">
            <Authentication />
          </TabsContent>
          <TabsContent value="headers">
            <Headers />
          </TabsContent>
          <TabsContent value="body">
            <Body />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Options;
