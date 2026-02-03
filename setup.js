const { Pool } = require('pg');

// Database configuration for initial setup
const setupPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'numugisha',
    port: 5432,
});

async function setupDatabase() {
    try {
        console.log('Setting up Talent Show Database...');
        
        // Create database
        console.log('Creating database "talent_show"...');
        await setupPool.query('CREATE DATABASE talent_show;');
        console.log('✓ Database created successfully');
        
        // Close setup connection and connect to the new database
        await setupPool.end();
        
        const talentPool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'talent_show',
            password: 'numugisha',
            port: 5432,
        });
        
        console.log('Running database schema...');
        
        // Read and execute the schema file
        const fs = require('fs');
        const schema = fs.readFileSync('database.sql', 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
        
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i].trim();
            if (statement.length > 0) {
                try {
                    await talentPool.query(statement);
                    console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
                } catch (err) {
                    // Ignore errors for statements that might already exist (like ON CONFLICT)
                    if (!err.message.includes('already exists') && !err.message.includes('duplicate')) {
                        console.log(`⚠ Warning executing statement ${i + 1}: ${err.message}`);
                    }
                }
            }
        }
        
        await talentPool.end();
        
        console.log('\n🎉 Database setup completed successfully!');
        console.log('You can now start the application with: npm start');
        
    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        
        if (error.code === '3D000') {
            console.log('\n💡 The database "talent_show" already exists.');
            console.log('You can run the schema manually by executing the SQL statements in database.sql');
        }
        
        process.exit(1);
    }
}

// Run setup if this script is executed directly
if (require.main === module) {
    setupDatabase();
}

module.exports = { setupDatabase };