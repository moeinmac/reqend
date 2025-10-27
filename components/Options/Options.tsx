import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHttpStore } from "@/store/useHttpStore";
import { ArrowRight, Download, Upload, Users } from "lucide-react";
import { FC } from "react";
import Authentication from "./Authentication/Authentication";
import Params from "./Params/Params";
import { useShallow } from "zustand/react/shallow";
import Body from "../Body/Body";
import { useRequestStore } from "@/store/useRequestStore";

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
            <TabsTrigger value="setting">Setting</TabsTrigger>
          </TabsList>
          <TabsContent value="params">
            <Params />
          </TabsContent>
          <TabsContent value="authentication">
            <Authentication />
          </TabsContent>
          <TabsContent value="headers">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium">Groups</h3>
                <p className="text-muted-foreground">Manage your group memberships and settings.</p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <span>Design Team</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <span>Marketing Squad</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <span>Engineering Crew</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="body">
            <Body />
          </TabsContent>
          <TabsContent value="setting">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium">Backup & Restore</h3>
                <p className="text-muted-foreground">Manage your account backups and restore points.</p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="size-5 text-muted-foreground" />
                    <span>Backup Account</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="size-5 text-muted-foreground" />
                    <span>Restore Account</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Options;
