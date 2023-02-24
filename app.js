const mysql = require("mysql2");
const inquirer = require("inquirer");
const newTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",

 
  password: "",
  database: "company_db"
});

const start = () => {
    inquirer
      .prompt([
        {
          name: "options",
          type: "list",
          message: "Choose one of the options below.",
          choices: [
            "View all Employees?",
            "View all Roles?",
            "View all Departments",
            "Search for Employees by Manager",
            "Update Employees manager",
            "Update Employee roles",
            "Add Role?",
            "Add Employee?",
            "Add Department?",
            "Remove an Employee",
            "Remove a Role",
            "Remove a Department",
            "Get Department's total utilized budget",
          ],
        },
      ])
  
      .then((answer) => {
        switch (answer.options) {
          case "View all Employees?":
            viewAllEmploy();
            break;
  
          case "View all Roles?":
            viewRoles();
            break;
  
          case "View all Departments":
            viewDepart();
            break;
  
          case "Search for Employees by Manager":
            viewEmployeesByManager();
            break;
  
          case "Update Employee roles":
            updateEmployRoles();
            break;
  
          case "Update Employees manager":
            updateManage(); 
            break;
  
          case "Add Employee?":
            addEmployee();
            break;
  
          case "Add Role?":
            addRole();
            break;
  
          case "Add Department?":
            addDept();
            break;
  
          case "Remove an Employee":
            removeEmployee();
            break;
  
          case "Remove a Role":
            removeRole();
            break;
  
          case "Remove a Department":
            removeDept();
            break;
  
          case "Get Department's total utilized budget":
            salaries();
            break;
        }
      });
  };
  
  const viewAllEmploy = () => {
    connection.query("SELECT * FROM employee;", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  };

  const viewRoles = () => {
    connection.query("Select * FROM roles", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  };
  
  const viewDepart = () => {
    connection.query("Select * FROM department", (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  };

  const viewEmployeesByManager = () => {
    connection.query("SELECT * FROM employee", (err, managers) => {
      if (err) throw err;
      let newManager = managers.map((manager) => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: `${manager.id}: ${manager.first_name} ${manager.last_name}`,
      }));
      inquirer
        .prompt([
          {
            name: "manager",
            type: "rawlist",
            message: "What is the employees managers name?",
            choices: newManager,
          },
        ])
        .then((answer) => {
          newManager = answer.manager.split(":");
          connection.query(
            "SELECT * FROM employee WHERE ?",
            {
              manager_id: newManager[0],
            },
  
            (err, res) => {
              if (err) throw err;
              console.table(
                `${newManager[1]} is the manager of these employees: `,
                res
              );

              start();
            }
          );
        });
    });
  };
  

  const addEmployee = () => {
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;
      let newRoles = roles.map((role) => ({ name: role.title, value: role.id }));
  
      connection.query("SELECT * FROM employee", (err, managers) => {
        if (err) throw err;
        let newManager = managers.map((manager) => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        }));
        inquirer
          .prompt([
            {
              name: "firstName",
              type: "input",
              message: "Please enter employees first name.",
            },
            {
              name: "lastName",
              type: "input",
              message: "Please enter employees last name.",
            },
            {
              name: "role",
              type: "rawlist",
              message: "What is the employees role?",
              choices: newRoles,
            },
            {
              name: "manager",
              type: "rawlist",
              message: "What is the employees managers name?",
              choices: newManager,
            },
          ])
          .then((answer) => {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: answer.manager,
                role_id: answer.role,
              },
  
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} employee inserted!\n`);

                start();
              }
            );
          });
      });
    });
  };


  const addRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
      if (err) throw err;
      let newDepartment = departments.map((department) => ({
        name: `${department.name}`,
        value: department.id,
      }));
      inquirer
        .prompt([
          {
            name: "roleName",
            type: "input",
            message: "Please enter your Role name.",
          },
          {
            name: "salary",
            type: "input",
            message: "Please enter salary.",
          },
          {
            name: "department",
            type: "rawlist",
            message: "What department is your role in?",
            choices: newDepartment,
          },
        ])
        .then((answer) => {
          connection.query(
            "INSERT INTO roles SET ?",
            {
              title: answer.roleName,
              salary: answer.salary,
              department_id: answer.department,
            },
  
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} role inserted!\n`);
        
              start();
            }
          );
        });
    });
  };

  
  const addDept = () => {
    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "Please enter your New Department name.",
        },
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.newDept,
          },
  
          (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} department inserted!\n`);

            start();
          }
        );
      });
  };
  

  const updateEmployRoles = () => {
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;
      let newRoles = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
  
      connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        let newEmployee = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
        inquirer
          .prompt([
            {
              name: "employee",
              type: "rawlist",
              message: "Which employee do you want to update?",
              choices: newEmployee,
            },
            {
              name: "role",
              type: "rawlist",
              message: "What is the employees new role?",
              choices: newRoles,
            },
          ])
          .then((answer) => {
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: answer.role,
                },
                {
                  id: answer.employee,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} new role's inserted!\n`);
                
                start();
              }
            );
          });
      });
    });
  };
  
  
  const updateManage = () => {
    connection.query("SELECT * FROM employee", (err, managers) => {
      if (err) throw err;
      let newManagers = managers.map((manager) => ({
        name: `${manager.first_name} ${manager.last_name}`,
        value: manager.id,
      }));
  
      connection.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;
        let newEmployee = employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));
        inquirer
          .prompt([
            {
              name: "employee",
              type: "rawlist",
              message: "Which employee do you want to update?",
              choices: newEmployee,
            },
            {
              name: "manager",
              type: "rawlist",
              message: "What is the employees new manager?",
              choices: newManagers,
            },
          ])
          .then((answer) => {
            // console.log(answer.manager, answer.employee );
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  manager_id: answer.manager,
                },
                {
                  id: answer.employee,
                },
              ],
              (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} new manager inserted!\n`);
                console.table(res);
                // Call start AFTER the INSERT completes
                start();
              }
            );
          });
      });
    });
  };
  
  
  const removeEmployee = () => {
    connection.query("SELECT * FROM employee", (err, employees) => {
      if (err) throw err;
      let deleteEmployee = employees.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            message: "Which employee would you like to remove?",
            choices: deleteEmployee,
          },
        ])
        .then((answer) => {
          connection.query(
            "DELETE FROM employee WHERE ?",
            {
              id: answer.employee,
            },
  
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} employee deleted!\n`);
              // Call start AFTER the INSERT completes
              start();
            }
          );
        });
    });
  };
  

  
  const removeRole = () => {
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;
      let deleteRole = roles.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      inquirer
        .prompt([
          {
            name: "role",
            type: "rawlist",
            message: "Which role would you like to remove?",
            choices: deleteRole,
          },
        ])
        .then((answer) => {
          connection.query(
            "DELETE FROM roles WHERE ?",
            {
              id: answer.role,
            },
  
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} role deleted!\n`);
    
              start();
            }
          );
        });
    });
  };
  
  
  const removeDept = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
      if (err) throw err;
      let deleteDepartment = departments.map((department) => ({
        name: `${department.name}`,
        value: department.id,
      }));
      inquirer
        .prompt([
          {
            name: "department",
            type: "rawlist",
            message: "What department would you like to remove?",
            choices: deleteDepartment,
          },
        ])
        .then((answer) => {
          connection.query(
            "DELETE FROM department WHERE ?",
            {
              id: answer.department,
            },
  
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} department deleted!\n`);

              start();
            }
          );
        });
    });
  };
  
  const salaries = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
      if (err) throw err;
      let salaryDepartment = departments.map((department) => ({
        name: `${department.name}`,
        value: department.id,
      }));
      inquirer
        .prompt([
          {
            name: "department",
            type: "rawlist",
            message:
              "What department's total utilized budget would you like to view?",
            choices: salaryDepartment,
          },
        ])
        .then((answer) => {
          connection.query(
            "SELECT SUM(salary) AS budget FROM roles WHERE ?",
            {
              department_id: answer.department,
            },
            (err, res) => {
              if (err) throw err;
              console.table(res);
              start();
            }
          );
        });
    });
  };

  connection.connect((err) => {
    if (err) throw err;
    start();
      });