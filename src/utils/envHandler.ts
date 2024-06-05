// get the environment variable
const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

// Declare variables
let PORT: number;
let MONGODB_URI: string;
let DB_NAME: string;
let JWT_SECRET: string;

// Validate the environment variables
try {
  PORT = parseInt(getEnvVariable("PORT"), 10);
  MONGODB_URI = getEnvVariable("MONGODB_URI");
  DB_NAME = getEnvVariable("DB_NAME");
  JWT_SECRET = getEnvVariable("JWT_SECRET");
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}

// Export the variables after validation
export { PORT, MONGODB_URI, DB_NAME, JWT_SECRET };
