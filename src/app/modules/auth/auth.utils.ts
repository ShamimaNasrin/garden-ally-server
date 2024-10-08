import jwt from "jsonwebtoken";
import config from "../../config";

export const createToken = (
  jwtPayload: { email: string; role: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt_access_secret as string) as {
      email: string;
    };
  } catch (err) {
    throw new Error("Invalid token");
  }
};
