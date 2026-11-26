import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 生成高强度随机凭证（模拟专属链接 token） */
export function generateToken(length = 24): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(array[i] % chars.length);
  }
  return result;
}
