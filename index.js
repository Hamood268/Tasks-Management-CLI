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
            return json.parse(data)
        } catch (error) {
            return [];
        }
    }

    saveTasks() {
        fs.writeFileSync(this.filename, JSON.stringify(this.tasks, null, 2))
    }

    addtasks(title, priority = 'Medium', dueDate = null) {
        const tasks = {
            id: Date.now(),
            title,
            priority,
            dueDate,
            compeleted: false,
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
                
Added: ${task.id},
Title: ${task.title},
Priority: ${task.priority},
Due At: ${task.dueDate || 'No Due Date'},
Completed: ${task.compeleted ? 'Completed' : 'Pending'}.
--------------------------------------
                `)
        });
    }

    compeletedTask(id) {
        const taskIndex = this.id.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].compeleted = true;
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
                                taskManager.compeletedTask(Number(id));
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
                        rl.on('line', function (input) {
                            console.log('Program existing')
                            rl.pause(); // pause
                            doAsynsStuff(input).then(function () {
                              rl.prompt(); // resume
                            }).catch(function () {
                              rl.prompt(); // resume
                            });
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