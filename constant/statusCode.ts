export type StatusCategory = "information" | "success" | "redirection" | "clientError" | "serverError" | "notStandard";

export type StatusItem = {
  category: StatusCategory;
  message: string;
};

export type StatusCode = Record<string, StatusItem>;

export const statusCodes: StatusCode = {
  // 1xx: Informational
  100: { category: "information", message: "Continue" },
  101: { category: "information", message: "Switching Protocols" },
  102: { category: "information", message: "Processing" },
  103: { category: "information", message: "Early Hints" },

  // 2xx: Success
  200: { category: "success", message: "OK" },
  201: { category: "success", message: "Created" },
  202: { category: "success", message: "Accepted" },
  203: { category: "success", message: "Non-Authoritative Information" },
  204: { category: "success", message: "No Content" },
  205: { category: "success", message: "Reset Content" },
  206: { category: "success", message: "Partial Content" },
  207: { category: "success", message: "Multi-Status" },
  208: { category: "success", message: "Already Reported" },
  226: { category: "success", message: "IM Used" },

  // 3xx: Redirection
  300: { category: "redirection", message: "Multiple Choices" },
  301: { category: "redirection", message: "Moved Permanently" },
  302: { category: "redirection", message: "Found" },
  303: { category: "redirection", message: "See Other" },
  304: { category: "redirection", message: "Not Modified" },
  305: { category: "redirection", message: "Use Proxy" }, // deprecated
  306: { category: "redirection", message: "Switch Proxy (Unused)" },
  307: { category: "redirection", message: "Temporary Redirect" },
  308: { category: "redirection", message: "Permanent Redirect" },

  // 4xx: Client Error
  400: { category: "clientError", message: "Bad Request" },
  401: { category: "clientError", message: "Unauthorized" },
  402: { category: "clientError", message: "Payment Required" },
  403: { category: "clientError", message: "Forbidden" },
  404: { category: "clientError", message: "Not Found" },
  405: { category: "clientError", message: "Method Not Allowed" },
  406: { category: "clientError", message: "Not Acceptable" },
  407: { category: "clientError", message: "Proxy Authentication Required" },
  408: { category: "clientError", message: "Request Timeout" },
  409: { category: "clientError", message: "Conflict" },
  410: { category: "clientError", message: "Gone" },
  411: { category: "clientError", message: "Length Required" },
  412: { category: "clientError", message: "Precondition Failed" },
  413: { category: "clientError", message: "Payload Too Large" }, // formerly Request Entity Too Large
  414: { category: "clientError", message: "URI Too Long" }, // formerly Request-URI Too Long
  415: { category: "clientError", message: "Unsupported Media Type" },
  416: { category: "clientError", message: "Range Not Satisfiable" },
  417: { category: "clientError", message: "Expectation Failed" },
  418: { category: "notStandard", message: "I'm a teapot (RFC 2324, April Fools)" },
  419: { category: "notStandard", message: "Page Expired (commonly used by some frameworks like Laravel)" },
  421: { category: "clientError", message: "Misdirected Request" },
  422: { category: "clientError", message: "Unprocessable Entity" },
  423: { category: "clientError", message: "Locked" },
  424: { category: "clientError", message: "Failed Dependency" },
  425: { category: "clientError", message: "Too Early" }, // RFC 8470
  426: { category: "clientError", message: "Upgrade Required" },
  428: { category: "clientError", message: "Precondition Required" },
  429: { category: "clientError", message: "Too Many Requests" },
  430: { category: "notStandard", message: "Request Header Fields Too Large (rare/non-standard uses)" },
  431: { category: "clientError", message: "Request Header Fields Too Large" },
  440: { category: "notStandard", message: "Login Timeout (Microsoft/IIS)" },
  444: { category: "notStandard", message: "No Response (Nginx)" },
  449: { category: "notStandard", message: "Retry With (Microsoft)" },
  450: { category: "notStandard", message: "Blocked by Windows Parental Controls (Microsoft)" },
  451: { category: "clientError", message: "Unavailable For Legal Reasons" },
  498: { category: "notStandard", message: "Invalid Token (Esri)" },
  499: { category: "notStandard", message: "Client Closed Request (Nginx)" },

  // 5xx: Server Error
  500: { category: "serverError", message: "Internal Server Error" },
  501: { category: "serverError", message: "Not Implemented" },
  502: { category: "serverError", message: "Bad Gateway" },
  503: { category: "serverError", message: "Service Unavailable" },
  504: { category: "serverError", message: "Gateway Timeout" },
  505: { category: "serverError", message: "HTTP Version Not Supported" },
  506: { category: "serverError", message: "Variant Also Negotiates" },
  507: { category: "serverError", message: "Insufficient Storage" },
  508: { category: "serverError", message: "Loop Detected" },
  509: { category: "notStandard", message: "Bandwidth Limit Exceeded (some servers)" },
  510: { category: "serverError", message: "Not Extended" },
  511: { category: "serverError", message: "Network Authentication Required" },

  // Cloudflare / reverse-proxy / gateway common responses (not official HTTP codes)
  520: { category: "notStandard", message: "Web Server Returned an Unknown Error (Cloudflare)" },
  521: { category: "notStandard", message: "Web Server Is Down (Cloudflare)" },
  522: { category: "notStandard", message: "Connection Timed Out (Cloudflare)" },
  523: { category: "notStandard", message: "Origin Is Unreachable (Cloudflare)" },
  524: { category: "notStandard", message: "A Timeout Occurred (Cloudflare)" },
  525: { category: "notStandard", message: "SSL Handshake Failed (Cloudflare)" },
  526: { category: "notStandard", message: "Invalid SSL Certificate (Cloudflare)" },

  // Other commonly-seen non-standard / client library codes
  598: { category: "notStandard", message: "Network Read Timeout Error (used by some proxies)" },
  599: { category: "notStandard", message: "Network Connect Timeout Error (used by some proxies)" },
};

export const statusColor: Record<StatusCategory, string> = {
  information: "#ffffff",
  clientError: "#ff2056",
  serverError: "#e7000b",
  success: "#00bc7d",
  redirection: "#ffb900",
  notStandard: "#ad46ff",
};
