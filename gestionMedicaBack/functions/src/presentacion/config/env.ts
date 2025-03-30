// presentacion/config/env.ts
export const env = {
  PORT: process.env.PORT || 3000,
  API_VERSION: process.env.API_VERSION || "v1",
  NODE_ENV: process.env.NODE_ENV || "development",
  PROJECT_NAME: "gestionMedicaBack",
};
