// scripts/init-db.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'library_management',
};

// Helper function to execute SQL queries
async function query(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Initialize the database (create tables if they don't exist)
async function initDatabase() {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'librarian', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create subscriptions table
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan ENUM('basic-monthly', 'premium-monthly', 'basic-yearly', 'premium-yearly') NOT NULL,
        status ENUM('active', 'cancelled', 'expired') DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create branches table
    await query(`
      CREATE TABLE IF NOT EXISTS branches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        opening_hours TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create books table
    await query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        isbn VARCHAR(20) UNIQUE,
        publisher VARCHAR(255),
        publication_year INT,
        description TEXT,
        category VARCHAR(100),
        pages INT,
        cover_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create book_copies table
    await query(`
      CREATE TABLE IF NOT EXISTS book_copies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT NOT NULL,
        branch_id INT NOT NULL,
        status ENUM('available', 'borrowed', 'reserved', 'maintenance') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
      )
    `);

    // Create borrowings table
    await query(`
      CREATE TABLE IF NOT EXISTS borrowings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_copy_id INT NOT NULL,
        borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        due_date TIMESTAMP NOT NULL,
        return_date TIMESTAMP NULL,
        status ENUM('borrowed', 'returned', 'overdue') DEFAULT 'borrowed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_copy_id) REFERENCES book_copies(id) ON DELETE CASCADE
      )
    `);

    // Create reservations table
    await query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        book_id INT NOT NULL,
        branch_id INT NOT NULL,
        reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiry_date TIMESTAMP NOT NULL,
        status ENUM('pending', 'fulfilled', 'expired', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
        FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE CASCADE
      )
    `);

    // Insert sample branch data
    await query(`
      INSERT IGNORE INTO branches (id, name, address, city, postal_code, phone, email)
      VALUES 
        (1, 'Central Library', '123 Main St', 'London', 'EC1A 1BB', '020-1234-5678', 'central@aml.co.uk'),
        (2, 'North Branch', '456 North Rd', 'Manchester', 'M1 1AA', '0161-876-5432', 'north@aml.co.uk'),
        (3, 'East Branch', '789 East Ave', 'Birmingham', 'B1 1AA', '0121-765-4321', 'east@aml.co.uk')
    `);

    // Insert sample book data
    await query(`
      INSERT IGNORE INTO books (id, title, author, isbn, publisher, publication_year, category, pages, cover_url)
      VALUES 
        (1, 'The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Scribner', 1925, 'Fiction', 180, '/placeholder.svg?key=22tu6'),
        (2, 'To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'HarperCollins', 1960, 'Fiction', 281, '/placeholder.svg?key=ath6t'),
        (3, '1984', 'George Orwell', '9780451524935', 'Signet Classics', 1949, 'Fiction', 328, '/placeholder.svg?key=1984'),
        (4, 'Pride and Prejudice', 'Jane Austen', '9780141439518', 'Penguin Classics', 1813, 'Fiction', 432, '/placeholder.svg?key=sdze7'),
        (5, 'The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 'Little, Brown and Company', 1951, 'Fiction', 277, '/placeholder.svg?key=wfu3h')
    `);

    // Insert sample book copies
    await query(`
      INSERT IGNORE INTO book_copies (book_id, branch_id, status)
      VALUES 
        (1, 1, 'available'),
        (1, 2, 'available'),
        (2, 1, 'available'),
        (2, 3, 'available'),
        (3, 1, 'available'),
        (3, 2, 'available'),
        (4, 3, 'available'),
        (5, 1, 'available')
    `);

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

// Run the initialization
initDatabase()
  .then(() => {
    console.log("Database setup complete!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });