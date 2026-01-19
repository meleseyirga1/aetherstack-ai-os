/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["ssh2", "node-ssh"],
  typescript: { ignoreBuildErrors: true },
};
module.exports = nextConfig;