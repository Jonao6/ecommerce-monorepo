export const config = {
  port: parseInt(process.env.API_PORT || "4000"),
  environment: process.env.NODE_ENV || "development",
  includeStacktrace: process.env.NODE_ENV !== "production",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "ecommerce",
  },
};
