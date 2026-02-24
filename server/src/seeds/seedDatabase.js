require('dotenv').config({ path: '../../../.env' });
const mongoose = require('mongoose');
const { Pool } = require('pg');
const { Assignment } = require('../models');

const sampleAssignments = [
  {
    title: 'Select All Employees',
    description: 'Learn the basics of SELECT statements',
    difficulty: 'easy',
    category: 'SELECT',
    question: 'Write a query to retrieve all columns for all employees in the employees table.',
    hint: 'The SELECT statement is used to fetch data from a database. Use * to select all columns.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'email', type: 'VARCHAR(100)', constraints: 'UNIQUE' },
          { name: 'department_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' },
          { name: 'hire_date', type: 'DATE', constraints: '' }
        ],
        sampleDataQuery: 'SELECT * FROM employees LIMIT 5'
      }
    ],
    expectedOutputDescription: 'A table with all employee records showing id, first_name, last_name, email, department_id, salary, and hire_date.',
    solutionQuery: 'SELECT * FROM employees',
    points: 10,
    timeEstimate: '5 minutes',
    order: 1
  },
  {
    title: 'Filter by Department',
    description: 'Learn to use WHERE clause for filtering',
    difficulty: 'easy',
    category: 'SELECT',
    question: 'Write a query to find all employees who work in department_id 2.',
    hint: 'The WHERE clause is used to filter records based on conditions.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'email', type: 'VARCHAR(100)', constraints: 'UNIQUE' },
          { name: 'department_id', type: 'INTEGER', constraints: 'FOREIGN KEY' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' },
          { name: 'hire_date', type: 'DATE', constraints: '' }
        ],
        sampleDataQuery: 'SELECT * FROM employees LIMIT 5'
      }
    ],
    expectedOutputDescription: 'A table showing only employees where department_id equals 2.',
    solutionQuery: 'SELECT * FROM employees WHERE department_id = 2',
    points: 10,
    timeEstimate: '5 minutes',
    order: 2
  },
  {
    title: 'Join Employees with Departments',
    description: 'Learn to combine data from multiple tables using JOIN',
    difficulty: 'medium',
    category: 'JOIN',
    question: 'Write a query to display each employee\'s first name, last name, and their department name.',
    hint: 'Use INNER JOIN to combine tables based on matching column values.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'department_id', type: 'INTEGER', constraints: 'FOREIGN KEY' }
        ],
        sampleDataQuery: 'SELECT id, first_name, last_name, department_id FROM employees LIMIT 5'
      },
      {
        tableName: 'departments',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
          { name: 'location', type: 'VARCHAR(100)', constraints: '' }
        ],
        sampleDataQuery: 'SELECT * FROM departments LIMIT 5'
      }
    ],
    expectedOutputDescription: 'A table with three columns: first_name, last_name, and the department name for each employee.',
    solutionQuery: 'SELECT e.first_name, e.last_name, d.name FROM employees e INNER JOIN departments d ON e.department_id = d.id',
    points: 20,
    timeEstimate: '10-15 minutes',
    order: 3
  },
  {
    title: 'Count Employees per Department',
    description: 'Learn to use aggregate functions with GROUP BY',
    difficulty: 'medium',
    category: 'AGGREGATE',
    question: 'Write a query to count the number of employees in each department. Show the department name and employee count.',
    hint: 'Use COUNT() aggregate function with GROUP BY to group results.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: '' },
          { name: 'department_id', type: 'INTEGER', constraints: 'FOREIGN KEY' }
        ],
        sampleDataQuery: 'SELECT id, first_name, department_id FROM employees LIMIT 5'
      },
      {
        tableName: 'departments',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(50)', constraints: 'NOT NULL' }
        ],
        sampleDataQuery: 'SELECT * FROM departments LIMIT 5'
      }
    ],
    expectedOutputDescription: 'A table with department name and the count of employees in each department.',
    solutionQuery: 'SELECT d.name, COUNT(e.id) as employee_count FROM departments d LEFT JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name',
    points: 25,
    timeEstimate: '10-15 minutes',
    order: 4
  },
  {
    title: 'Find Above Average Salaries',
    description: 'Learn to use subqueries for complex filtering',
    difficulty: 'hard',
    category: 'SUBQUERY',
    question: 'Write a query to find all employees whose salary is above the average salary of all employees.',
    hint: 'You can use a subquery to calculate the average and compare against it.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: '' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: '' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' }
        ],
        sampleDataQuery: 'SELECT id, first_name, last_name, salary FROM employees LIMIT 5'
      }
    ],
    expectedOutputDescription: 'A list of employees (with their names and salaries) who earn more than the company average.',
    solutionQuery: 'SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)',
    points: 30,
    timeEstimate: '15-20 minutes',
    order: 5
  },
  {
    title: 'Top 3 Highest Paid per Department',
    description: 'Master window functions for advanced analytics',
    difficulty: 'hard',
    category: 'MIXED',
    question: 'Write a query to find the top 3 highest-paid employees in each department. Display department name, employee name, and salary.',
    hint: 'Consider using ROW_NUMBER() or RANK() window function with PARTITION BY.',
    tables: [
      {
        tableName: 'employees',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'first_name', type: 'VARCHAR(50)', constraints: '' },
          { name: 'last_name', type: 'VARCHAR(50)', constraints: '' },
          { name: 'department_id', type: 'INTEGER', constraints: '' },
          { name: 'salary', type: 'DECIMAL(10,2)', constraints: '' }
        ],
        sampleDataQuery: 'SELECT * FROM employees LIMIT 5'
      },
      {
        tableName: 'departments',
        columns: [
          { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
          { name: 'name', type: 'VARCHAR(50)', constraints: 'NOT NULL' }
        ],
        sampleDataQuery: 'SELECT * FROM departments'
      }
    ],
    expectedOutputDescription: 'A table showing department name, employee full name, and salary for the top 3 earners in each department.',
    solutionQuery: `WITH ranked AS (
      SELECT d.name as department, e.first_name, e.last_name, e.salary,
             ROW_NUMBER() OVER (PARTITION BY e.department_id ORDER BY e.salary DESC) as rank
      FROM employees e
      JOIN departments d ON e.department_id = d.id
    )
    SELECT department, first_name, last_name, salary FROM ranked WHERE rank <= 3`,
    points: 40,
    timeEstimate: '20-30 minutes',
    order: 6
  }
];

// SQL to create and populate PostgreSQL tables
const postgresSetupSQL = `
-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- Create departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    location VARCHAR(100)
);

-- Create employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    salary DECIMAL(10, 2),
    hire_date DATE
);

-- Insert sample departments
INSERT INTO departments (name, location) VALUES
    ('Engineering', 'Building A'),
    ('Marketing', 'Building B'),
    ('Human Resources', 'Building C'),
    ('Finance', 'Building A'),
    ('Sales', 'Building B');

-- Insert sample employees
INSERT INTO employees (first_name, last_name, email, department_id, salary, hire_date) VALUES
    ('John', 'Smith', 'john.smith@company.com', 1, 85000.00, '2020-03-15'),
    ('Sarah', 'Johnson', 'sarah.johnson@company.com', 1, 92000.00, '2019-07-22'),
    ('Michael', 'Williams', 'michael.williams@company.com', 1, 78000.00, '2021-01-10'),
    ('Emily', 'Brown', 'emily.brown@company.com', 2, 65000.00, '2020-09-01'),
    ('David', 'Jones', 'david.jones@company.com', 2, 68000.00, '2019-11-15'),
    ('Jessica', 'Davis', 'jessica.davis@company.com', 3, 55000.00, '2021-06-20'),
    ('Christopher', 'Miller', 'chris.miller@company.com', 3, 58000.00, '2018-04-05'),
    ('Ashley', 'Wilson', 'ashley.wilson@company.com', 4, 72000.00, '2020-02-28'),
    ('Matthew', 'Moore', 'matt.moore@company.com', 4, 88000.00, '2017-08-12'),
    ('Amanda', 'Taylor', 'amanda.taylor@company.com', 4, 95000.00, '2016-05-30'),
    ('Daniel', 'Anderson', 'daniel.anderson@company.com', 5, 62000.00, '2021-03-18'),
    ('Jennifer', 'Thomas', 'jennifer.thomas@company.com', 5, 71000.00, '2019-09-25'),
    ('James', 'Jackson', 'james.jackson@company.com', 1, 105000.00, '2015-11-08'),
    ('Lisa', 'White', 'lisa.white@company.com', 2, 73000.00, '2020-07-14'),
    ('Robert', 'Harris', 'robert.harris@company.com', 5, 82000.00, '2018-10-22');
`;

async function seedDatabase() {
  console.log('Starting database seeding...\n');

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersql');
    console.log('✓ MongoDB connected\n');

    // Clear existing assignments
    console.log('Clearing existing assignments...');
    await Assignment.deleteMany({});
    console.log('✓ Cleared existing assignments\n');

    // Insert sample assignments
    console.log('Inserting sample assignments...');
    const inserted = await Assignment.insertMany(sampleAssignments);
    console.log(`✓ Inserted ${inserted.length} assignments\n`);

    // Connect to PostgreSQL
    console.log('Connecting to PostgreSQL...');
    const pool = new Pool({
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT) || 5432,
      database: process.env.PG_DATABASE || 'ciphersql_sandbox',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'password'
    });

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✓ PostgreSQL connected\n');

    // Setup PostgreSQL tables
    console.log('Setting up PostgreSQL tables...');
    await pool.query(postgresSetupSQL);
    console.log('✓ PostgreSQL tables created and populated\n');

    // Verify data
    const empCount = await pool.query('SELECT COUNT(*) FROM employees');
    const deptCount = await pool.query('SELECT COUNT(*) FROM departments');
    console.log(`\nData verification:`);
    console.log(`  - Departments: ${deptCount.rows[0].count}`);
    console.log(`  - Employees: ${empCount.rows[0].count}`);

    await pool.end();

    console.log('\n========================================');
    console.log('✓ Database seeding completed successfully!');
    console.log('========================================\n');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleAssignments, postgresSetupSQL };
