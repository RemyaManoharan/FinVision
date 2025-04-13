import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function initializeProductionDatabase() {
    const pool = new Pool ({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const schemaPath = path.join(__dirname, '..', '..', 'src', 'scripts', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        // Execute the SQL commands
    console.log('Creating tables in production environment...');
    await pool.query(schema);
    console.log('Tables created successfully in production');
    try {
        const seedPath = path.join(__dirname, '..', '..', 'src', 'scripts', 'seed.sql');
        const seed = fs.readFileSync(seedPath, 'utf-8');
        // Execute the SQL commands
        console.log('Seeding tables in production environment...');
        await pool.query(seed);
        console.log('Tables seeded successfully in production');
    } catch (error) {
        console.error('Error seeding tables in production', error); 
    }

    }
    catch (error) {
        console.error('Error creating tables in production', error);
    }
    finally {
       await pool.end();
    }
}
async function initializeDevelopmentDatabase() {
    const adminPool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: 'postgres', // Connect to default postgres database
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });
    try {
        // Check if database exists
        const checkDbResult = await adminPool.query(
          "SELECT datname FROM pg_catalog.pg_database WHERE datname = 'finvision'"
        );
    
        if (checkDbResult.rowCount === 0) {
          console.log('Creating finvision database...');
          await adminPool.query('CREATE DATABASE finvision');
          console.log('finvision database created successfully');
        } else {
          console.log('finvision database already exists');
        }
      } catch (err) {
        console.error('Error creating database:', err);
        throw err;
      } finally {
        await adminPool.end();
      }
     // Now connect to the finvision database to create tables
  const finvisionPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'finvision', // Now connect to our finvision database
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', '..', 'src', 'scripts', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the SQL commands
    console.log('Creating tables...');
    await finvisionPool.query(schema);
    console.log('Tables created successfully');

    // Read and execute the seed file if it exists
    try {
      const seedPath = path.join(__dirname, '..', '..', 'src', 'scripts', 'seed.sql');
      const seed = fs.readFileSync(seedPath, 'utf8');
      console.log('Seeding database...');
      await finvisionPool.query(seed);
      console.log('Database seeded successfully');
    } catch (seedErr) {
      console.log('No seed file found or error seeding database:', seedErr);
    }
  } catch (err) {
    console.error('Error creating tables:', err);
    throw err;
  } finally {
    await finvisionPool.end();
  }
}

// Main execution
async function initializeDatabase() {
  // Check if we're in production environment
  if (process.env.NODE_ENV === 'production') {
    try {
      await initializeProductionDatabase();
      console.log('Production database initialization completed successfully');
    } catch (err) {
      console.error('Production database initialization failed:', err);
      process.exit(1);
    }
  } else {
    // Development environment
    try {
      await initializeDevelopmentDatabase();
      console.log('Development database initialization completed successfully');
    } catch (err) {
      console.error('Development database initialization failed:', err);
      process.exit(1);
    }
  }
}

// Run the initialization
initializeDatabase();