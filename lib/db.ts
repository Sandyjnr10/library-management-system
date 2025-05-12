import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: Number.parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "library_management",
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Track if database has been initialized
let dbInitialized = false

// Helper function to execute SQL queries with auto-initialization
export async function query(sql: string, params: any[] = []) {
  try {
    // Auto-initialize database if not already done
    if (!dbInitialized) {
      try {
        // Try to query users table to check if it exists
        await pool.execute("SELECT 1 FROM users LIMIT 1")
        dbInitialized = true
      } catch (error: any) {
        // If table doesn't exist, initialize the database
        if (error.code === "ER_NO_SUCH_TABLE") {
          console.log("Database tables not found. Initializing database...")
          await initDatabase()
          dbInitialized = true
        } else {
          throw error
        }
      }
    }

    // Special handling for transaction commands - don't use prepared statements
    const transactionCommands = ["START TRANSACTION", "COMMIT", "ROLLBACK"]
    if (transactionCommands.some((cmd) => sql.toUpperCase().includes(cmd))) {
      const connection = await pool.getConnection()
      try {
        await connection.query(sql)
        return { affectedRows: 0 }
      } finally {
        connection.release()
      }
    }

    // Regular query with prepared statements
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Get a connection from the pool
query.getConnection = async () => await pool.getConnection()

// Initialize the database (create tables if they don't exist)
export async function initDatabase() {
  try {
    console.log("Starting database initialization...")

    // Create users table
    console.log("Creating users table...")
    await pool.execute(`
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
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        plan ENUM('basic-monthly', 'premium-monthly', 'basic-yearly', 'premium-yearly') NOT NULL,
        status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create branches table
    console.log("Creating branches table...")
    await pool.execute(`
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
    await pool.execute(`
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
    await pool.execute(`
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
    await pool.execute(`
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
    await pool.execute(`
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
    console.log("Checking if sample data is needed...")
    const [users] = await pool.execute("SELECT COUNT(*) as count FROM users")
    if ((users as any)[0].count === 0) {
      console.log("Inserting sample data...")

      // Insert sample branches
      await pool.execute(`
        INSERT INTO branches (name, address, city, postal_code, phone, email, opening_hours)
        VALUES 
          ('Central Library', '123 Main Street', 'London', 'EC1A 1BB', '+44 20 1234 5678', 'central@advancedmedialibrary.co.uk', '{"monday":"9:00 AM - 8:00 PM","tuesday":"9:00 AM - 8:00 PM","wednesday":"9:00 AM - 8:00 PM","thursday":"9:00 AM - 8:00 PM","friday":"9:00 AM - 6:00 PM","saturday":"10:00 AM - 5:00 PM","sunday":"Closed"}'),
          ('North Branch', '45 Park Avenue', 'Manchester', 'M1 1AA', '+44 161 1234 5678', 'north@advancedmedialibrary.co.uk', '{"monday":"9:00 AM - 6:00 PM","tuesday":"9:00 AM - 6:00 PM","wednesday":"9:00 AM - 6:00 PM","thursday":"9:00 AM - 8:00 PM","friday":"9:00 AM - 6:00 PM","saturday":"10:00 AM - 4:00 PM","sunday":"Closed"}')
      `)

      // Insert sample books with detailed descriptions
      await pool.execute(`
        INSERT INTO books (title, author, isbn, publisher, publication_year, description, category, pages, cover_url)
        VALUES 
          ('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Scribner', 1925, 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway''s interactions with mysterious millionaire Jay Gatsby and Gatsby''s obsession to reunite with his former lover, Daisy Buchanan. A true classic of American literature that captures the economic prosperity and social change of the 1920s.', 'Fiction', 180, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-great-gatsby.jpg-tflYIFUSP7bn9XbnI5PS4pBzbb3Mo4.jpeg'),
          
          ('To Kill a Mockingbird', 'Harper Lee', '9780061120084', 'HarperCollins', 1960, 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores with exuberant humor the irrationality of adult attitudes to race and class in the Deep South of the 1930s.', 'Fiction', 281, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockingbird.jpg-J9isyrifsAeIqu3oaSWxdiIx1UG6N7.jpeg'),
          
          ('1984', 'George Orwell', '9780451524935', 'Signet Classics', 1949, 'Among the seminal texts of the 20th century, 1984 is a rare work that grows more haunting as its futuristic purgatory becomes more real. Published in 1949, the book offers political satirist George Orwell''s nightmarish vision of a totalitarian, bureaucratic world and one poor stiff''s attempt to find individuality.', 'Science Fiction', 328, 'https://v0.blob.com/9y97e'),
          
          ('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Penguin Classics', 1813, 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work "her own darling child" and its vivacious heroine, Elizabeth Bennet, "as delightful a creature as ever appeared in print."', 'Romance', 432, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pride.jpg-bZSoXiOwfQ1VzAER23J95PeBfEblmp.jpeg'),
          
          ('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 'Little, Brown and Company', 1951, 'The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield. Through circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days.', 'Fiction', 277, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/catcher.jpg-XNX1rBk7LgvyxkKKTa2chPfCDMXQ5K.webp')
      `)

      // Link books to branches (create book copies)
      await pool.execute(`
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
      await pool.execute(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Test User', 'test@example.com', 'password123', 'user')
      `)

      // Create a subscription for the test user
      await pool.execute(`
        INSERT INTO subscriptions (user_id, plan, status)
        VALUES (1, 'premium-monthly', 'active')
      `)
    }

    console.log("Database initialization completed successfully!")
    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

// Function to update database schema if needed
export async function updateDatabaseSchema() {
  try {
    console.log("Checking if database schema update is needed...")

    // Check if 'pending' status exists in subscriptions table
    try {
      // Try to insert a test record with 'pending' status
      const connection = await pool.getConnection()
      try {
        await connection.beginTransaction()

        // Try to insert with pending status
        try {
          await connection.execute(`
            INSERT INTO subscriptions (user_id, plan, status) 
            VALUES (1, 'basic-monthly', 'pending')
          `)
          // If successful, delete the test record
          await connection.execute(`
            DELETE FROM subscriptions 
            WHERE user_id = 1 AND status = 'pending'
          `)
          await connection.commit()
          console.log("Database schema is up to date.")
          return true
        } catch (error: any) {
          await connection.rollback()

          // If error is about the status column, alter the table
          if (error.code === "WARN_DATA_TRUNCATED" || error.errno === 1265) {
            console.log("Updating subscriptions table schema to include 'pending' status...")

            // Alter the table to modify the status enum
            await pool.execute(`
              ALTER TABLE subscriptions 
              MODIFY COLUMN status ENUM('active', 'cancelled', 'expired', 'pending') DEFAULT 'active'
            `)

            console.log("Database schema updated successfully!")
            return true
          } else {
            throw error
          }
        }
      } finally {
        connection.release()
      }
    } catch (error) {
      console.error("Error checking/updating schema:", error)
      throw error
    }
  } catch (error) {
    console.error("Database schema update error:", error)
    throw error
  }
}

// Call updateDatabaseSchema when the module is imported
updateDatabaseSchema().catch(console.error)
