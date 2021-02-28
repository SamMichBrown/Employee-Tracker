const mysql = require('mysql2');
const inquirer = require('inquirer');

const viewAllDept = () => {
    connection.query(
    'SELECT * FROM `department`',
      (err, results, fields) => {
      console.table(results);
      initialPrompt()
      }
   );
}

const viewAllRoles = () => {
  connection.query(
    'SELECT * FROM `role`',
     (err, results) => {
      console.table(results);
      initialPrompt()
     }
  );
}

const viewAllEmployees = () => {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, title, department.name as department, salary, CONCAT(manager.first_name, " ", manager.last_name) as manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee manager
    ON employee.manager_id = manager.id`,
     (err, results) => {
      console.table(results);
      initialPrompt()
     }
  );
}

const addDepartment = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'newDepartment',
      message:'What is the new department?'
    }
  ])
  .then(data => {
    connection.query(
      'INSERT INTO department SET ?',
        {
          name: data.newDepartment
        },
        (err, results) => {
          if (err) {
            console.log(err);
        }
        initialPrompt()
      }
    )
  });
}

const addRole = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'newRole',
      message:'What is the new role?'
    },
    {
      type:'input',
      name:'newSalary',
      message:'What is the new salary?'
    },
    {
      type:'input',
      name:'newRoleId',
      message:'What is the new id?'
    }
  ])
  .then(data => {
    connection.query(
      'INSERT INTO role SET ?',
        {
          title: data.newRole,
          salary: data.newSalary,
          department_id: data.newRoleId
        },
        (err, results) => {
          if (err) {
            console.log(err);
        }
        initialPrompt()
      }
    )
  });
}

const addEmployee = () => {
  inquirer.prompt([
    {
      type:'input',
      name:'newEmployeeFirstName',
      message:"What is the new employee's first name?"
    },
    {
      type:'input',
      name:'newEmployeeLastName',
      message:"What is the new employee's last name?"
    },
    {
      type:'input',
      name:'newEmployeeRoleId',
      message:'What is the new role id?'
    },
    {
    type:'input',
    name:'newEmployeeManagerId',
    message:'What is the new manager id?'
    }
  ])
  .then(data => {
    connection.query(
      'INSERT INTO employee SET ?',
        {
          first_name: data.newEmployeeFirstName,
          last_name: data.newEmployeeLastName,
          role_id: data.newEmployeeRoleId,
          manager_id: data.newEmployeeManagerId
        },
        (err, results) => {
          if (err) {
            console.log(err);
        }
        initialPrompt()
      }
    )
  });
}

const updateRole = () => {
  connection.query(
    'SELECT * FROM  role;',
    (err, results) => {
      console.log('\n')
      console.table(results);
    }
  );
  inquirer.prompt([
    {
      type:'input',
      name:'updatedEmployeeRole',
      message:"Which employee's role would you like to update?"
    },
    {
      type:'input',
      name:'updatedEmployeeRoleId',
      message:"Enter employee's role id?"
    } 
  ])
  .then(data => {
    connection.query(
      `UPDATE employee SET role_id = ? WHERE id = ?`,
        [data.updatedEmployeeRoleId, data.updatedEmployeeRole],
        (err, results) => {
          if (err) {
            console.log(err);
        }
        initialPrompt()
      }
    )
  });
}

// Questions ARRAY
const initialPrompt = () => {
  inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
      }
  ])
  .then(data => {
    console.log(data);
    if (data.selection === 'View all departments') {
        viewAllDept()

    }else if (data.selection === 'View all roles') {
      viewAllRoles()
    }else if (data.selection === 'View all employees') {
      viewAllEmployees()
    }else if (data.selection === "Add a department") {
      addDepartment()
    }else if (data.selection === "Add a role") {
      addRole()
    }else if (data.selection === "Add an employee") {
      addEmployee()
    }else if (data.selection === "Update an employee role") {
      updateRole()
    }
  })
}

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'PassWord',
  database: 'employee_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  initialPrompt();
});
