-- DEPARTMENT SEEDS ---
INSERT INTO department(name)
VALUES 
  ("Legal"), 
  ("Human Resources"), 
  ("Engineering"), 
  ("Sales");

-- EMPLOYEE ROLE SEEDS -------
INSERT INTO roles (title, salary, department_id)
VALUES 
  ("Lead Engineer", 150000, 2),
  ("Legal Team Lead", 250000, 4),
  ("Accountant", 125000, 3),
  ("Sales Lead", 100000, 1),
  ("Salesperson", 80000, 1),
  ("Software Engineer", 120000, 2),
  ("Lawyer", 190000, 4);

-- EMPLOYEE SEEDS -------
INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES 
  ("Darth", "Vader", null, 1),
  ("Patrick", "Star", null, 2),
  ("Sandy", "Squirl", null, 3),
  ("Bread", "Top", 1, 4),
  ("Shelby", "Chanyo", 4, 5),
  ("Tony", "Hawk", 3, 6),
  ("John", "Mean", 2, 7);
