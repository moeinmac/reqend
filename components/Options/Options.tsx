import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Bookmark, Clock, Download, Upload, Users } from "lucide-react";
import Params from "./Params/Params";
import Authentication from "./Authentication/Authentication";

const Options = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Options</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <Tabs defaultValue="params">
          <TabsList className="mb-2">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
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
            <div className="grid gap-4">
              <div className="border-b pb-4">
                <h3 className="font-medium">Comments</h3>
                <p className="text-muted-foreground">Manage and respond to comments on your account.</p>
              </div>
              <div className="grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Jill Watson</div>
                      <div className="text-xs text-muted-foreground">2 days ago</div>
                    </div>
                    <p className="text-muted-foreground">Great work on the new design! Really love the clean look and feel.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Tom Hanks</div>
                      <div className="text-xs text-muted-foreground">1 week ago</div>
                    </div>
                    <p className="text-muted-foreground">Awesome job on the new features! Can&apos;t wait to try them out.</p>
                  </div>
                </div>
              </div>
            </div>
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
