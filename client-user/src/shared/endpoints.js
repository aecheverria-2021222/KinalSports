// c:\gitIN6AM\KinalSports\client-user\src\shared\endpoints.js

export const ENDPOINTS = {
  AUTH: process.env.EXPO_PUBLIC_AUTH_URL || "http://localhost:3007/api/v1/auth",
  USER: process.env.EXPO_PUBLIC_USER_URL || "http://localhost:3008/kinalSportsUser/v1"
};
