import { JWTPayload, jwtVerify, SignJWT } from "jose";

interface UserJWTPayload extends JWTPayload {
  jti: string;
  iat: number;
  userId: string;
}

const secret = process.env.JWT_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secret);

export const getJWTSecretKey = () => {
  if (!secret || secret.length === 0) {
    throw new Error("The environmental variable not safe.");
  }
  return secret;
};

export const verifyAuth = async (token: string) => {
  try {
    const verified = await jwtVerify(token, encodedKey);
    return verified.payload as UserJWTPayload;
  } catch (error) {
    throw new Error("Your token has expired.");
  }
};

export async function encrypt(
  payload: UserJWTPayload,
  expirationTime: string = "15m"
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}
