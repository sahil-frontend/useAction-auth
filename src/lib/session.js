"use server";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// Setup keys
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Encrypt session data
export const encrypt = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

// Decrypt session data
export const decrypt = async (session) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch {
    return null;
  }
};

// Create a temporary session for unverified users (OTP verification)
export const createTempUserSession = async (email) => {
  const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  const cookieStore = await cookies();
  const existingSession = cookieStore.get("tempUser")?.value;

  let sessionData = { email, otpExpiry };

  if (existingSession) {
    try {
      const existingPayload = await decrypt(existingSession);
      sessionData = { ...existingPayload, email, otpExpiry };
    } catch (error) {
      console.error("Failed to decrypt existing tempUser cookie:", error);
    }
  }

  const encrypted = await encrypt(sessionData);

  cookieStore.set("tempUser", encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(otpExpiry),
    sameSite: "lax",
    path: "/",
  });
};

// Retrieve temporary user session (used for OTP verification)
export const getTempUser = async () => {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("tempUser")?.value;

    if (!session) {
      return null;
    }

    const payload = await decrypt(session);
    return payload || null;
  } catch (error) {
    return null;
  }
};

// Clear tempUser cookie
export async function clearTempUser() {
  const cookieStore = await cookies();
  cookieStore.delete("tempUser");
}
