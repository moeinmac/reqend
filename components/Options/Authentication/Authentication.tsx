import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FC } from "react";

const Authentication: FC = () => {
  return (
    <div>
      <div>
        <h2>Auth Type</h2>
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select auth type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="noAuth">No Auth</SelectItem>
              <SelectItem value="bearerToken">Bearer Token</SelectItem>
              <SelectItem value="basicAuth">Basic Auth</SelectItem>
              <SelectItem value="oAuth">O Auth</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Authentication;
