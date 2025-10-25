import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HttpResponse } from "@/store/useHttpStore";
import { FC } from "react";
import { JsonViewer } from "./JsonViewer";
import ResponseHeaders from "./ResponseHeaders";

const tabs: { name: string; value: "body" | "headers" }[] = [
  {
    name: "Body",
    value: "body",
  },
  {
    name: "Headers",
    value: "headers",
  },
];

interface ResponseTabProps {
  headers: HttpResponse["headers"];
  data: HttpResponse["data"];
}

const ResponseTab: FC<ResponseTabProps> = ({ headers, data }) => {
  return (
    <div className="w-full my-4">
      <Tabs defaultValue="body">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="w-full">
            <div className="w-full">
              {tab.value === "headers" ? (
                <ResponseHeaders headers={headers} />
              ) : (
                <div className="border rounded-lg p-4 bg-card overflow-auto">
                  <JsonViewer data={data} rootName="data" />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ResponseTab;
