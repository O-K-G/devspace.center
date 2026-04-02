import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  transpilePackages: ["@exodus/bytes", "html-encoding-sniffer"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
