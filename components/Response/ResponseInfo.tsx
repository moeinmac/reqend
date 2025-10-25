import { FC } from "react";
import prettyBytes from "pretty-bytes";
import { statusCodes, statusColor } from "@/constant/statusCode";
import { Badge } from "../ui/badge";

interface ResponseHeaderProps {
  size: number;
  statusCode: number;
}

const ResponseHeader: FC<ResponseHeaderProps> = ({ size, statusCode }) => {
  const status = {
    statusCode: statusCode,
    message: statusCode in statusCodes ? statusCodes[statusCode].message : "",
    background: statusCode in statusCodes ? statusColor[statusCodes[statusCode].category] : "inherit",
  };
  return (
    <div className="flex items-center gap-4">
      <span>Size : {prettyBytes(size)}</span>
      <Badge variant={"default"} style={{ backgroundColor: status?.background }}>{`${status.statusCode} ${status.message}`}</Badge>
    </div>
  );
};

export default ResponseHeader;
