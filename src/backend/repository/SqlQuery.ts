import SqlConnection from '@/backend/repository/SqlConnection';

/**
 * Represents a SQL query object.
 */
export class SqlQuery {
    /**
     * Insert data into the database.
     * @param query
     * @param variables
     */
    public static async insert(query: string, variables: any[]): Promise<any> {
        return await this.execute(query, variables);
    }

    /**
     * Select data from the database.
     * @param query
     * @param variables
     */
    public static async select(query: string, variables: any[]): Promise<any> {
        return await this.execute(query, variables);
    }

    /**
     * Update data in the database.
     * @param query
     * @param variables
     */
    public static async update(query: string, variables: any[]): Promise<any> {
        return await this.execute(query, variables);
    }

    private static async execute(query: string, variables: string[]): Promise<any> {
        'use server';
        return (await SqlConnection.getConnection()).query(query, variables);
    }
}
