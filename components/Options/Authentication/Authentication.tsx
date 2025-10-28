import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Auth } from "@/db/models.type";
import { useRequestStore } from "@/store/useRequestStore";
import { FC } from "react";
import { useShallow } from "zustand/react/shallow";

const Authentication: FC = () => {
  const { request, updateAuthType, updateAuthValue } = useRequestStore(
    useShallow((state) => ({
      request: state.request,
      updateAuthType: state.updateAuthType,
      fetched: state.fetched,
      updateAuthValue: state.updateAuthValue,
    }))
  );

  const authType = request?.auth?.authType ?? "noAuth";

  return (
    <div className="flex gap-6 h-24 mt-8">
      <div className="flex flex-col gap-4">
        <h2>Auth Type</h2>
        <div>
          <Select value={authType} onValueChange={async (value) => await updateAuthType(value as Auth["authType"])}>
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
      {authType !== "noAuth" && <Separator orientation="vertical" />}
      {authType !== "noAuth" && (
        <div className="flex flex-col gap-4 w-full">
          <h2>Auth Value</h2>
          <div className="flex items-center gap-4">
            {request?.auth.authType === "bearerToken" && (
              <Input
                className="w-8/12 max-w-96"
                placeholder="Token"
                name="bearerToken"
                value={request.auth?.value?.token ?? ""}
                onChange={async (event) => await updateAuthValue({ token: event.target.value })}
              />
            )}
            {request?.auth.authType === "basicAuth" && (
              <>
                <Input
                  className="w-6/12 max-w-96"
                  placeholder="Username"
                  name="username"
                  value={request.auth?.value?.username ?? ""}
                  onChange={async (event) => await updateAuthValue({ ...request.auth?.value, username: event.target.value })}
                />
                <Input
                  className="w-6/12 max-w-96"
                  placeholder="Password"
                  name="password"
                  value={request.auth?.value?.password ?? ""}
                  onChange={async (event) => await updateAuthValue({ ...request.auth?.value, password: event.target.value })}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
