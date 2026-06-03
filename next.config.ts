// Fix for broken global localStorage in this environment
if (
  typeof global !== "undefined" &&
  typeof localStorage !== "undefined" &&
  typeof (localStorage as any).getItem !== "function"
) {
  Object.defineProperty(global, "localStorage", {
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    },
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
