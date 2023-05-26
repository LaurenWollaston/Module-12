const mysql = require('mysql2/promise');
const env = require('dotenv').config();

// Function to execute SQL queries
async function executeQuery(query) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
  });

  try {
    await connection.query(query);
    console.log('Query executed successfully.');
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    connection.end();
  }
}

// Departments info
const departmentData = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'Finance' },
  ];
  
  // Roles info
  const roleData = [
    { id: 1, title: 'Sales Manager', salary: 50000, department_id: 1 },
    { id: 2, title: 'Marketing Coordinator', salary: 40000, department_id: 2 },
    { id: 3, title: 'Accountant', salary: 45000, department_id: 3 },
  ];
  
  // Employees info
  const employeeData = [
    { id: 1, first_name: 'John', last_name: 'Doe', role_id: 1, manager_id: 1 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', role_id: 2, manager_id: 1 },
    { id: 3, first_name: 'David', last_name: 'Johnson', role_id: 3, manager_id: 1 },
  ];

// Seed the departments table
departmentData.forEach((department) => {
  const query = `INSERT INTO department (id, name) VALUES (${department.id}, '${department.name}')`;
  executeQuery(query);
});

// Seed the roles table
roleData.forEach((role) => {
  const query = `INSERT INTO role (id, title, salary, department_id) VALUES (${role.id}, '${role.title}', ${role.salary}, ${role.department_id})`;
  executeQuery(query);
});

// Seed the employees table
employeeData.forEach((employee) => {
  const query = `INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (${employee.id}, '${employee.first_name}', '${employee.last_name}', ${employee.role_id}, ${employee.manager_id})`;
  executeQuery(query);
});