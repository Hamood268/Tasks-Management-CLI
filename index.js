const fs = require('fs');
const { stdin, stdout } = require('process');
const readline = require('readline');


class TaskManager {
    constructor(filename = 'tasks.json') {
        this.filename = filename
        this.tasks = this.loadTasks();
    }

    loadTasks() {
        try {
            const data = fs.readFileSync(this.filename, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            return [];
        }
    }

    saveTasks() {
        fs.writeFileSync(this.filename, JSON.stringify(this.tasks, null, 2))
    }

    addtasks(title, priority = 'Medium', dueDate = 'Not Defined') {
        if(!title.trim() || !priority.trim()){
            console.log('Inputs cannot be empty... ')
            return;
        }

        const tasks = {
            id: Date.now(),
            title: title.trim(),
            priority: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
            dueDate: dueDate || 'Not Defined',
            completed: false,
        };
        
        this.tasks.push(tasks);
        this.saveTasks();
        console.log('Tasks Added Sucessfully')
    }

    listTasks() {
        if (this.tasks.length === 0) {
            console.log("There isn't any tasks")
            return;
        }
        this.tasks.forEach(task => {
            console.log(`
                
ID: ${task.id},
Title: ${task.title},
Priority: ${task.priority},
Due At: ${task.dueDate || 'No Due Date'},
Completed: ${task.completed ? 'Completed' : 'Pending'}.
--------------------------------------
                `)
        });
    }

    completedTasks(id) {
        const taskIndex = this.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].completed = true;
            console.log('Task marked as Completed !')
        } else {
            console.log('No completed tasks')
        }
    }

    removeTask(id) {
        try {
            this.tasks = this.tasks.filter(task => task.id !== id)
            this.saveTasks()
            console.log('Task removed Sucessfully')
        } catch (error) {
            console.error('error removing task... ', error)
            return;
        }
    }

    // interactive Cli
    static start() {
        const rl = readline.createInterface({
            input: stdin,
            output: stdout
        })
        const taskManager = new TaskManager();

        function prompt() {
            rl.question(`
Task Manager Menu:
1. Add Task
2. List Tasks
3. Complete Task
4. Remove Task
5. Exit           

Choose an option... `, (answer) => {
                switch (answer) {
                    case '1':
                        rl.question('Enter the task title: ', (title) => {
                            rl.question('Enter the priority (Low/Medium/High): ', (priority) => {
                                rl.question('Enter the due date: ', (dueDate) => {
                                    taskManager.addtasks(title, priority, dueDate);
                                    prompt();
                                });
                            });
                        });
                        break;
                    case '2':
                        taskManager.listTasks();
                        prompt();

                        break;
                    case '3':
                        try {
                            rl.question('Enter the task ID to mark as complete: ', (id) => {
                                taskManager.completedTasks(Number(id));
                                prompt();
                            });
                        } catch (error) {
                            console.error('error marking as complete... ', error)
                        }
                        break;
                    case '4':
                        try {
                            rl.question('Enter the task ID to remove: ', (id) => {
                                taskManager.removeTask(Number(id));
                                prompt();
                            });

                        } catch (error) {
                            console.error('error removing task... ', error)
                        };

                        break;
                        case '5':
                            function animatedExit(seconds) {
                                return new Promise((resolve) => {
                                    let remaining = seconds;
                                    
                                    const spinner = ['|', '/', '-', '\\'];
                                    let spinnerIndex = 0;

                                    const timer = setInterval(() => {
                                        process.stdout.write(`\rExiting in ${remaining} seconds ${spinner[spinnerIndex]}`);
                                        
                                        spinnerIndex = (spinnerIndex + 1) % 4;
                                        remaining--;

                                        if (remaining < 0) {
                                            clearInterval(timer);
                                            console.log('\nGoodbye!');
                                            resolve();
                                        }
                                    }, 1000);
                                });
                            }

                            animatedExit(5).then(() => {
                                rl.pause(); // Pause the readline interface
                                rl.close(); // Close the interface
                                process.exit(0); // Forcefully exit the process
                            });
                            break;
                    default:
                        console.log('Invalid input');
                        prompt();
                }
            })
        }

        prompt();

    }
}

TaskManager.start();