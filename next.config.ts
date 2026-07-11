import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/post/the-great-luxury-collapse-of-2026-and-who-survived-it-unfettered",
        destination: "/blog/the-great-luxury-collapse-of-2026-and-who-survived-it-unfettered",
        permanent: true,
      },
      {
        source: "/post/the-five-types-of-luxury-brands-and-why-the-better-ones-never-fit-into-just-one",
        destination: "/blog/the-five-types-of-luxury-brands-and-why-the-better-ones-never-fit-into-just-one",
        permanent: true,
      },
      {
        source: "/post/the-three-types-of-luxury-consumers",
        destination: "/blog/the-three-types-of-luxury-consumers",
        permanent: true,
      },
      {
        source: "/post/the-multifaceted-guise-of-luxury",
        destination: "/blog/the-multifaceted-guise-of-luxury",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
