require('dotenv').config()

interface DBConfig {
    connectionLimit: number
    host?: string
    user?: string
    password?: string
    database?: string
}

interface EnvConfig {
    PORT?: number
    JWT_SECRET?: string
    PERCENTAGE_CHARGE?: number
    WIN_PATH?: string
    UNIX_PATH?: string
}

export const dbConfig: DBConfig = {
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};


export const envConfig: EnvConfig = {
    PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : undefined,
    JWT_SECRET: process.env.JWT_SECRET,
    PERCENTAGE_CHARGE: process.env.PERCENTAGE_CHARGE ? parseFloat(process.env.PERCENTAGE_CHARGE) : undefined,
    WIN_PATH: process.env.WIN_PATH,
    UNIX_PATH: process.env.UNIX_PATH,

};

export const config = {}
