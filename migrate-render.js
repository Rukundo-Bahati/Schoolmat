const { Client } = require('pg');

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://schoolmart_db_user:ZwL7iRCr5NjjNorZtHVurp7x8LxYk7pu@dpg-d3mbf0buibrs73dsbtvg-a.oregon-postgres.render.com/schoolmart_db_sl0i',
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔄 Connecting to Render database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check if column exists
    console.log('🔍 Checking if isActive column exists...');
    const checkResult = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'isActive'
    `);

    if (checkResult.rows.length === 0) {
      console.log('➕ Adding isActive column to products table...');
      await client.query('ALTER TABLE "products" ADD "isActive" boolean NOT NULL DEFAULT true');
      console.log('✅ Migration completed successfully!');
      
      // Verify the column was added
      const verifyResult = await client.query(`
        SELECT column_name, data_type, column_default 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'isActive'
      `);
      console.log('📊 Column details:', verifyResult.rows[0]);
      
      // Check sample data
      const sampleResult = await client.query('SELECT id, name, "isActive" FROM products LIMIT 3');
      console.log('📋 Sample products with isActive field:');
      sampleResult.rows.forEach(row => {
        console.log(`  - ${row.name}: isActive = ${row.isActive}`);
      });
      
    } else {
      console.log('✅ Migration already applied - isActive column exists');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🎉 Database connection closed');
  }
}

runMigration().catch(console.error);