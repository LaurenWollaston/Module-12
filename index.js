const inquirer = require("inquirer");
const mysql = require('mysql2/promise');
const env = require('dotenv').config();
const { Query } = require("./utils/utils");
const Table = require('cli-table');
var userinput = {};
var tempTable;
var connection;

async function init() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD
        });

        const answer = await inquirer.prompt([
            {
                name: 'MainChoice',
                message: "What would you like to do?",
                type: 'list',
                choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role'],
            }
        ]);
        userinput = answer;
        await display(answer);
    } catch (error) {
        console.error('Error occurred:', error);
    } finally {
        if (connection) {
            connection.end();
        }
    }
}

async function display(answer) {
    if (answer.MainChoice === 'view all roles') {
        const query = new Query();
        var tempTable = await query.getAllRoles(connection);
        var table = new Table({
            head:['Role ID', 'Job Title', 'Department', 'Salary'],
            colWidths: [10, 25, 15, 10]
        });
        for (const role of tempTable){
            const department = await query.getDepartmentById(connection, role.department_id);
            table.push([
                role.id,
                role.title,
                department.name,
                role.salary
            ])
        }
    console.log(table.toString());
    } else if (answer.MainChoice === 'view all employees') {
        const query = new Query();
        var tempTable = await query.getAllEmployees(connection);

        var table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 10, 15]
        });

        for (const employee of tempTable) {
            // Fetch role and department information based on the id in the employees table
            const role = await query.getRoleById(connection, employee.role_id);
            const department = await query.getDepartmentById(connection, role.department_id);

            table.push([
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name,
                role.salary,
                employee.manager_id
            ]);
        }

        console.log(table.toString());
    } else if (answer.MainChoice === 'view all departments') {
        const query = new Query();
        var tempTable = await query.getAllDepartments(connection);
        var table = new Table({
            head: ['ID', 'Department'],
            colWidths: [5, 25]
        });
        for (const department of tempTable){
            table.push([
                department.id,
                department.name,
            ])
        }
        console.log(table.toString());
    }
    else if (answer.MainChoice === 'add a department') {
        const query = new Query();
        var tempTable = await query.getAllDepartments(connection);

        var newDept = await inquirer.prompt([
            {
                name: 'choiceDeptName',
                message: "What is the new departments name?",
                type: 'input',
            }
        ]);
        var insertNewDept = await query.addDepartment(connection, newDept.choiceDeptName)
        if(insertNewDept){
            console.log("Department Added.")
        };
        var tempTable2 = await query.getAllDepartments(connection);

        var table = new Table({
            head: ['ID', 'Department'],
            colWidths: [5, 25]
        });
        for (const department of tempTable2){
            table.push([
                department.id,
                department.name,
            ])
        }
        console.log(table.toString());
    }
    else if (answer.MainChoice === 'add a role') {
        const query = new Query();
        var tempTable = await query.getAllRoles(connection);
        var tempTableDepts = await query.getAllDepartments(connection);
        var preRenderChoiceString = [];

        for(i=0;i<tempTableDepts.length;i++){
                preRenderChoiceString.push(tempTableDepts[i].name);
        }
        
        var newRole = await inquirer.prompt([
            {
                name: 'choiceRoleTitle',
                message: "What is the new role's title?",
                type: 'input',
            },
            {
                name: 'choiceRoleSalary',
                message: "What is the new role's salary?",
                type: 'number',
            },
            {
                name: 'choiceRoleDept',
                message: "What department is the new role under?",
                type: 'list',
                choices:preRenderChoiceString,
            }
        ]);
        var departmentid = await query.getDepartmentByName(connection, newRole.choiceRoleDept);
        var insertNewRole = await query.addRole(connection, newRole.choiceRoleTitle, newRole.choiceRoleSalary, departmentid.id)
        if(insertNewRole){
            console.log("Role Added.")
        };
        var tempTable2 = await query.getAllRoles(connection);

        var table = new Table({
            head:['Role ID', 'Job Title', 'Department', 'Salary'],
            colWidths: [10, 25, 15, 10]
        });
        for (const role of tempTable2){
            const department = await query.getDepartmentById(connection, role.department_id);
            table.push([
                role.id,
                role.title,
                department.name,
                role.salary
            ])
        }
        console.log(table.toString());
    }
    else if (answer.MainChoice === 'add an employee') {
        const query = new Query();
        var tempTable = await query.getAllEmployees(connection);
        var tempTableRoles = await query.getAllRoles(connection);
        var preRenderChoiceString = [];
        var preRenderChoiceString_Manager = [];

        for(i=0;i<tempTableRoles.length;i++){
                preRenderChoiceString.push(tempTableRoles[i].title);
        }
        for(i=0;i<tempTable.length;i++){
            preRenderChoiceString_Manager.push(`${tempTable[i].first_name} ${tempTable[i].last_name}`)
        }
        var newRole = await inquirer.prompt([
            {
                name: 'choiceEmployeeFName',
                message: "What is the new employee's first name?",
                type: 'input',
            },
            {
                name: 'choiceEmployeeLName',
                message: "What is the new employee's last name?",
                type: 'input',
            },
            {
                name: 'choiceEmployeeRole',
                message: "What is the new employee's role?",
                type: 'list',
                choices:preRenderChoiceString,
            },
            {
                name: 'choiceEmployeeManager',
                message: "Who is the new employee's manager?",
                type: 'list',
                choices:preRenderChoiceString_Manager,
            }
        ]);
        var manager = await query.getEmployeeByName(connection, newRole.choiceEmployeeManager)
        var role = await query.getRoleByTitle(connection, newRole.choiceEmployeeRole);
        console.log(manager.id);
        console.log(newRole.choiceEmployeeFName, newRole.choiceEmployeeLName, role.id, manager.id)
        var insertNewEmployee = await query.addEmployee(connection, newRole.choiceEmployeeFName, newRole.choiceEmployeeLName, role.id, manager.id)
        if(insertNewEmployee){
            console.log("Employee Added.")
        };
        var tempTable2 = await query.getAllEmployees(connection);

        var table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 10, 15]
        });

        for (const employee of tempTable2) {
            const role = await query.getRoleById(connection, employee.role_id);
            const department = await query.getDepartmentById(connection, role.department_id);

            table.push([
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name,
                role.salary,
                employee.manager_id
            ]);
        }
        console.log(table.toString());
    }
    else if (answer.MainChoice === 'update an employee role') {
        const query = new Query();
        var tempTable = await query.getAllEmployees(connection);
        var tempTableRoles = await query.getAllRoles(connection);
        var preRenderChoiceString = [];
        var preRenderChoiceString_Roles = [];

        for(i=0;i<tempTable.length;i++){
                preRenderChoiceString.push(`'${tempTable[i].first_name} ${tempTable[i].last_name}'` );
        }
        for(i=0;i<tempTableRoles.length;i++){
            preRenderChoiceString_Roles.push(`'${tempTableRoles[i].title}'` );
    }

        var updateEmployee = await inquirer.prompt([
            {
                name: 'employeeUpdate',
                message: "Select an employee to update:",
                type: 'list',
                choices:preRenderChoiceString,
            },
            {
                name: 'employeeNewRole',
                message: "Select a new role for the employee:",
                type: 'list',
                choices:preRenderChoiceString_Roles,
            },
        ]);

        var employeeName = updateEmployee.employeeUpdate.replace(/'/g, ""); // Remove the single quotes
        var employeeSelected = await query.getEmployeeByName(connection, employeeName.trim()); // Trim any leading/trailing spaces        
        var roleTitle = updateEmployee.employeeNewRole.replace(/'/g, ""); // Remove the single quotes
        var roleSelected = await query.getRoleByTitle(connection, roleTitle.trim()); // Trim any leading/trailing spaces


        var updated = await query.updateEmployee(connection, employeeSelected.id, roleSelected.id);
        var tempTable2 = await query.getAllEmployees(connection);
        var table = new Table({
            head: ['ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'],
            colWidths: [5, 15, 15, 15, 15, 10, 15]
        });

        for (const employee of tempTable2) {
            const role = await query.getRoleById(connection, employee.role_id);
            const department = await query.getDepartmentById(connection, role.department_id);

            table.push([
                employee.id,
                employee.first_name,
                employee.last_name,
                role.title,
                department.name,
                role.salary,
                employee.manager_id
            ]);
        }
        console.log(table.toString());
    } else {
        console.log('Invalid choice');
    }
}

init();