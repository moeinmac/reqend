import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Auth } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";

const Authentication: FC = () => {
  const { request, updateAuthType } = useRequestStore(
    useShallow((state) => ({
      request: state.request,
      updateAuthType: state.updateAuthType,
      fetched: state.fetched,
    }))
  );

  return (
    <div className="flex">
      <div className="flex flex-col gap-4">
        <h2>Auth Type</h2>
        <div>
          <Select value={request!.auth!.authType ?? "noAuth"} onValueChange={async (value) => await updateAuthType(value as Auth["authType"])}>
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
