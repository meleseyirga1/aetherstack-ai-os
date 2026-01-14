/** @type {import('next').NextConfig} */
const nextConfig = {
  /* AetherStack AI Sovereign v16 Standard */
  serverExternalPackages: ["ssh2", "node-ssh"],
  
  // Note: ESLint and TypeScript checks are now handled 
  // at the root level in v16, not inside this object.
};

module.exports = nextConfig;