import * as mysql from 'mysql2/promise';
import {Pool} from 'mysql2/promise';

export default class SqlConnection {
    private static connectionPool: Promise<Pool> | undefined;

    public static async getConnection(): Promise<Pool> {
        'use server';
        if (!SqlConnection.connectionPool) {
            SqlConnection.connectionPool = SqlConnection.createPool();
        }
        return SqlConnection.connectionPool;
    }

    private static validateEnvVariables(): void {
        const requiredEnvVars: string[] = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE', 'MYSQL_PORT'];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`環境変数に${envVar}が設定されていません`);
            }
        }
    }

    private static async createPool(): Promise<Pool> {
        SqlConnection.validateEnvVariables();

        const host: string = process.env.MYSQL_HOST!;
        const user: string = process.env.MYSQL_USER!;
        const password: string = process.env.MYSQL_PASSWORD!;
        const database: string = process.env.MYSQL_DATABASE!;
        const port: number = Number(process.env.MYSQL_PORT!);

        return mysql.createPool({
            host: host,
            user: user,
            password: password,
            database: database,
            port: port,
            connectionLimit: 100,
            namedPlaceholders: true,
            queueLimit: 0,
            idleTimeout: 180000,
        });
    }
}
