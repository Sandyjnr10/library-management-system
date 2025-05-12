// Test database connection
import { query } from '../lib/db';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await query('SELECT 1 + 1 AS solution');
    console.log('Connection successful!');
    console.log('Test query result:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    process.exit();
  }
}

testConnection();