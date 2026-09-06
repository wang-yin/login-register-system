export const getCookieOptions = (maxAge?: number) => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,

    secure: isProduction,

    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    path: "/",

    ...(maxAge !== undefined && { maxAge }),
  };
};

export default getCookieOptions;
