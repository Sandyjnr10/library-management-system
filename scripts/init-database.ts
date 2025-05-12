import { query } from "../lib/db"

async function initDatabase() {
  try {
    console.log("Starting database initialization...")

    // Create users table
    console.log("Creating users table...")
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
    `)

    // Create subscriptions table
    console.log("Creating subscriptions table...")
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
    `)

    // Create branches table
    console.log("Creating branches table...")
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
    `)

    // Create books table
    console.log("Creating books table...")
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
    `)

    // Create book_copies table
    console.log("Creating book_copies table...")
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
    `)

    // Create borrowings table
    console.log("Creating borrowings table...")
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
    `)

    // Create reservations table
    console.log("Creating reservations table...")
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
    `)

    // Insert sample data
    console.log("Inserting sample data...")

    // Insert sample branches
    await query(`
      INSERT INTO branches (name, address, city, postal_code, phone, email, opening_hours)
      VALUES 
        ('Central Library', '123 Main Street', 'London', 'EC1A 1BB', '+44 20 1234 5678', 'central@advancedmedialibrary.co.uk', '{"monday":"9:00 AM - 8:00 PM","tuesday":"9:00 AM - 8:00 PM","wednesday":"9:00 AM - 8:00 PM","thursday":"9:00 AM - 8:00 PM","friday":"9:00 AM - 6:00 PM","saturday":"10:00 AM - 5:00 PM","sunday":"Closed"}'),
        ('North Branch', '45 Park Avenue', 'Manchester', 'M1 1AA', '+44 161 1234 5678', 'north@advancedmedialibrary.co.uk', '{"monday":"9:00 AM - 6:00 PM","tuesday":"9:00 AM - 6:00 PM","wednesday":"9:00 AM - 6:00 PM","thursday":"9:00 AM - 8:00 PM","friday":"9:00 AM - 6:00 PM","saturday":"10:00 AM - 4:00 PM","sunday":"Closed"}')
    `)

    // Insert sample books
    await query(`
      INSERT INTO books (title, author, isbn, publisher, publication_year, description, category, pages, cover_url)
      VALUES 
        ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Scribner', 1925, 'A novel about the American Dream set in the Jazz Age.', 'Fiction', 180, '/placeholder.svg?key=22tu6'),
        ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'HarperCollins', 1960, 'A novel about racial inequality in the American South.', 'Fiction', 281, '/placeholder.svg?key=ath6t'),
        ('1984', 'George Orwell', '9780451524935', 'Signet Classics', 1949, 'A dystopian novel about totalitarianism.', 'Fiction', 328, '/placeholder.svg?key=1984'),
        ('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Penguin Classics', 1813, 'A romantic novel about societal expectations.', 'Fiction', 432, '/placeholder.svg?key=sdze7'),
        ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 'Little, Brown and Company', 1951, 'A novel about teenage alienation.', 'Fiction', 277, '/placeholder.svg?key=wfu3h')
    `)

    // Link books to branches (create book copies)
    await query(`
      INSERT INTO book_copies (book_id, branch_id, status)
      VALUES 
        (1, 1, 'available'),
        (1, 2, 'available'),
        (2, 1, 'available'),
        (3, 1, 'available'),
        (3, 2, 'available'),
        (4, 1, 'available'),
        (5, 2, 'available')
    `)

    // Create a test user
    await query(`
      INSERT INTO users (name, email, password, role)
      VALUES ('Test User', 'test@example.com', 'password123', 'user')
    `)

    // Create a subscription for the test user
    await query(`
      INSERT INTO subscriptions (user_id, plan, status)
      VALUES (1, 'premium-monthly', 'active')
    `)

    console.log("Database initialization completed successfully!")
  } catch (error) {
    console.error("Database initialization error:", error)
  } finally {
    process.exit()
  }
}

// Run the initialization
initDatabase()
