import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const ResponseTab = () => {
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
            <div className="w-full">{tab.value === "headers" ? <ResponseHeaders /> : ""}</div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ResponseTab;
