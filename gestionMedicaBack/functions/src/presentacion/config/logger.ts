// presentacion/config/logger.ts
export const logger = {
  info: (...args: any[]) => console.log("🟢 [INFO]", ...args),
  error: (...args: any[]) => console.error("🔴 [ERROR]", ...args),
  warn: (...args: any[]) => console.warn("🟡 [WARN]", ...args),
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 [DEBUG]", ...args);
    }
  }
};
