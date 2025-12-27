export const ROLE_ROUTE_MAP: Record<string, string> = {
  ADMIN: "admin",
  QIRVEX: "console",
  REGULAR: "volunteer",
};

export const normalizePage = (v: string) => v.toLowerCase().replace(/\s+/g, "");