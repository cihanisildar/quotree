import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authToken = req.cookies.qf_auth_token;

  console.log("Cookies received:", req.cookies);
  console.log("Auth token:", authToken);

  if (!authToken) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string);
    (req as any).user = decoded; // Attach the user info to the request object
    console.log('Decoded token:', decoded);
    next(); // Call next() to pass control to the next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default authMiddleware;
