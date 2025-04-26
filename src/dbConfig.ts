// import * as mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const dbConfig = {
//   host: process.env.DB_HOST || "localhost",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "tikianaly",
// };

// export const getDbConnection = async () => {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     console.log("✅ Connected to MySQL database successfully!");
//     return connection;
//   } catch (error) {
//     console.error("❌ Database connection failed:", error);
//     process.exit(1);
//   }
// };


import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
  waitForConnections?: boolean;
  queueLimit?: number;
}

interface EnvConfig {
  PORT: number;
  JWT_SECRET: string;
  PERCENTAGE_CHARGE: number;
  WIN_PATH?: string;
  UNIX_PATH?: string;
  NODE_ENV?: string;
}

// Database configuration
export const dbConfig: DBConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tikianaly',
  connectionLimit: process.env.NODE_ENV === 'production' ? 10 : 20,
  waitForConnections: true,
  queueLimit: 0
};

// Environment configuration
export const envConfig: EnvConfig = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  PERCENTAGE_CHARGE: process.env.PERCENTAGE_CHARGE ? parseFloat(process.env.PERCENTAGE_CHARGE) : 0.0,
  WIN_PATH: process.env.WIN_PATH,
  UNIX_PATH: process.env.UNIX_PATH,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Connection pool singleton
let pool: mysql.Pool;

export const getDbConnection = async (): Promise<mysql.PoolConnection> => {
  try {
    if (!pool) {
      pool = mysql.createPool(dbConfig);
      console.log('✅ MySQL connection pool created');
    }
    
    const connection = await pool.getConnection();
    console.log('✅ Acquired MySQL connection from pool');
    return connection;
  } catch (error) {
    console.error('❌ Failed to get database connection:', error);
    throw error; // Throw instead of process.exit for better error handling
  }
};

export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log('✅ MySQL connection pool closed');
  }
};

