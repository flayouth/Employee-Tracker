const express = require('express');
const mysql = require('mysql2/promise');
const cTable = require('console.table');
const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 3306;

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Dontlovehoes1!',
  database: 'employees_db'
};

const init = async () => {
  const { userChoice } = await inquirer.prompt({
    type: 'list',
    name: 'userChoice',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  });

  switch (userChoice) {
    case 'View all departments':
      await viewDepartments();
      break;
    case 'View all roles':
      await viewRoles();
      break;
    case 'View all employees':
      await viewEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Exit':
      await db.end();
      process.exit();
  }
};

const runQuery = async (query, params) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(query, params);
    await connection.end();
    return rows;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const viewDepartments = async () => {
  console.log('Viewing all departments\n');
  const rows = await runQuery('SELECT * FROM department');
  console.table(rows);
  await init();
};

const viewRoles = async () => {
  console.log('Viewing all roles\n');
  const rows = await runQuery('SELECT * FROM role');
  console.table(rows);
  await init();
};

const viewEmployees = async () => {
  console.log('Viewing all employees\n');
  const rows = await runQuery('SELECT * FROM employee');
  console.table(rows);
  await init();
};

const addDepartment = async () => {
  const { department } = await inquirer.prompt({
    type: 'input',
    name: 'department',
    message: 'What is the name of the department you would like to add?'
  });
  await runQuery('INSERT INTO department (name) VALUES (?)', department);
  console.log('Success, department added\n');
  await init();
};

const addRole = async () => {
  const { title, salary, department_id } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of the role you would like to add?'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'What is the salary for this role?'
    },
    {
    type: 'input',
    name: 'department_id',
    message: 'What is the department ID for this role?'
    }
    ]);
    await runQuery('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, department_id]);
    console.log('Success, role added\n');
    await init();
    };
    
    const addEmployee = async () => {
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
    type: 'input',
    name: 'first_name',
    message: 'What is the first name of the employee you would like to add?'
    },
    {
    type: 'input',
    name: 'last_name',
    message: 'What is the last name of the employee you would like to add?'
    },
    {
    type: 'input',
    name: 'role_id',
    message: 'What is the role ID of the employee you would like to add?'
    },
    {
    type: 'input',
    name: 'manager_id',
    message: 'What is the manager ID of the employee you would like to add?'
    }
    ]);
    await runQuery('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [first_name, last_name, role_id, manager_id]);
    console.log('Success, employee added\n');
    await init();
    };
    
    const updateEmployeeRole = async () => {
    const { employee_id, role_id } = await inquirer.prompt([
    {
    type: 'input',
    name: 'employee_id',
    message: 'What is the ID of the employee you would like to update?'
    },
    {
    type: 'input',
    name: 'role_id',
    message: 'What is the new role ID for this employee?'
    }
    ]);
    await runQuery('UPDATE employee SET role_id = ? WHERE id = ?', [role_id, employee_id]);
    console.log('Success, employee role updated\n');
    await init();
    };
    
    app.listen(PORT, () => {
    console.log(`'App listening on port ${PORT}'`);
    });
    
    init();
