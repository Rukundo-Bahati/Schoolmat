const { execSync } = require('child_process');
const path = require('path');

// Simple migration runner that doesn't require TypeScript compilation
async function runMigration() {
  try {
    console.log('🔄 Running database migration...');
    
    // Check if we're in a production environment
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.log('📦 Production environment detected');
      
      // Try to run the migration using the compiled JavaScript
      try {
        execSync('node dist/migrations/1760687200000-AddIsActiveToProducts.js', { 
          stdio: 'inherit',
          cwd: process.cwd()
        });
      } catch (error) {
        console.log('⚠️  Compiled migration not found, running SQL directly...');
        
        // Fallback: Run the SQL directly using node-postgres
        const { Client } = require('pg');
        
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });
        
        await client.connect();
        
        try {
          // Check if the column already exists
          const checkResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'isActive'
          `);
          
          if (checkResult.rows.length === 0) {
            console.log('➕ Adding isActive column to products table...');
            await client.query('ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true');
            console.log('✅ Migration completed successfully!');
          } else {
            console.log('✅ Migration already applied - isActive column exists');
          }
        } finally {
          await client.end();
        }
      }
    } else {
      // Development environment - use TypeScript
      console.log('🔧 Development environment - using TypeScript migration');
      execSync('npm run migration:run', { stdio: 'inherit' });
    }
    
    console.log('🎉 Database migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);