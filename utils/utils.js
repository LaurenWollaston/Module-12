class Query {

  async getAllDepartments(connection) {
    const [depts] = await connection.execute('SELECT * FROM department');
    return depts;
  }

  async getAllRoles(connection) {
    const [roles] = await connection.execute('SELECT * FROM role');
    return roles;
  }

  async getAllEmployees(connection) {
    const [employees] = await connection.execute('SELECT * FROM employee');
    return employees;
  }

  async addDepartment(connection, name) {
    const [dept] = await connection.execute('INSERT INTO department (name) VALUES (?)', [name]);
    return dept.insertId;
  }

  async addRole(connection, title, salary, departmentId) {
    const [role] = await connection.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId]);
    return role.insertId;
  }

  async addEmployee(connection, firstName, lastName, roleId, manager_id) {
    const [emp] = await connection.execute('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [firstName, lastName, roleId, manager_id]);
    return emp.insertId;
  }
  async getRoleById(connection, roleId) {
    const [roles] = await connection.execute('SELECT * FROM role WHERE id = ?', [roleId]);
    return roles[0];
  }
  async getRoleByTitle(connection, roleTitle) {
    const [roles] = await connection.execute('SELECT * FROM role WHERE title = ?', [roleTitle]);
    return roles[0];
  }
  async getDepartmentById(connection, departmentId) {
    const [departments] = await connection.execute('SELECT * FROM department WHERE id = ?', [departmentId]);
    return departments[0];
  }
  async getEmployeeById(connection, employeeId) {
    const [employees] = await connection.execute('SELECT * FROM employee WHERE id = ?', [employeeId]);
    return employees[0];
  }
  async getEmployeeByName(connection, name) {
    const [employees] = await connection.execute('SELECT * FROM employee WHERE CONCAT(first_name, " ", last_name) = ?', [name]);
    return employees[0];
  }
  async getDepartmentByName(connection, departmentName) {
    const [departments] = await connection.execute('SELECT * FROM department WHERE name = ?', [departmentName]);
    return departments[0];
  }
  async updateEmployee(connection, employee, role){
    const [employees] = await connection.execute('UPDATE employee SET role_id = ? WHERE id = ?', [role, employee]);
    return employees[0];
  }
}

module.exports = { Query };