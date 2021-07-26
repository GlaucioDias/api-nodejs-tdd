
module.exports = {
    development: {
        client: 'pg',
        version: '9.4',
        connection: {
            // host: process.env.DB_URL || '127.0.0.1',
            // user: process.env.DB_USER || 'postgres',
            // password: process.env.DB_PASSWORD || 'root',
            // database: process.env.DB_DATABASE_NAME || 'srbarriga',
            // charset: process.env.DB_CHARSET || 'utf8',
            host: '127.0.0.1',
            user: 'postgres',
            password: 'root',
            database: 'srbarriga',
            charset: 'utf8',
        },
        pool: { 
            min: 0, 
            max: 30, 
            acquireTimeoutMillis: 30 * 1000 ,
            propagateCreateError: false,
        },
        migrations: {
            directory: __dirname + '/src/knex/migrations',
        },
        seeds: {
            directory: __dirname + '/src/knex/seeds',
        }
    },
};