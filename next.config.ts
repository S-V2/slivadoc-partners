import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by the container build (see Dockerfile): the runtime stage copies
  // .next/standalone and runs `node server.js`. Without this Next emits no
  // standalone output and the image build fails at the COPY.
  //
  // It is also what makes this app self-hostable at all. Vercel supplies its own
  // server and image optimizer; on our VM the container is the server, so Next
  // has to emit one.
  output: "standalone",
};

export default nextConfig;
