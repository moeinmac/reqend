import { statusCodes, statusColor } from "@/constant/statusCode";
import prettyBytes from "pretty-bytes";
import prettyTime from "pretty-time";
import { FC } from "react";
import { Badge } from "../ui/badge";

interface ResponseHeaderProps {
  size: number;
  statusCode: number;
  time: number;
}

const ResponseHeader: FC<ResponseHeaderProps> = ({ size, statusCode, time }) => {
  const status = {
    statusCode: statusCode,
    message: statusCode in statusCodes ? statusCodes[statusCode].message : "",
    background: statusCode in statusCodes ? statusColor[statusCodes[statusCode].category] : "inherit",
  };
  return (
    <div className="flex items-center gap-4">
      <span>Size : {prettyBytes(size)}</span>
      <Badge variant={"default"} style={{ backgroundColor: status?.background }}>{`${status.statusCode} ${status.message}`}</Badge>
      <span>{prettyTime(time * 1000 * 1000)}</span>
    </div>
  );
};

export default ResponseHeader;
