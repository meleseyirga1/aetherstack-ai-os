/** @type {import('next').NextConfig} */
const nextConfig = {
  /* AetherStack AI v16 Sovereign Standard */
  serverExternalPackages: ["ssh2", "node-ssh"],
  
  // v16 handles linting/types via separate files now
};

module.exports = nextConfig;