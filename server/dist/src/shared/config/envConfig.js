// src/shared/config/envConfig.ts
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
// Create the environment configuration object
const envConfig = {
    PORT: process.env.PORT || '5000',
    POSTGRES_URI: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/yourdbname', // Update this with your actual PostgreSQL connection string
    // Add more variables with defaults if necessary
};
export { envConfig };
//# sourceMappingURL=envConfig.js.map