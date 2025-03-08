sap.ui.define([
    "com/my/zfapctaskmgmt/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "com/my/zfapctaskmgmt/model/formatter",
    "sap/ui/core/Fragment",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox",
    "com/my/zfapctaskmgmt/repository/TaskRepository"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */

    function (BaseController,
        JSONModel,
        formatter,
        Fragment,
        BusyIndicator,
        MessageBox,
        TaskRepository,
    ) {
        "use strict";
        const APP_PATH = "com.my.zfapctaskmgmt";

        return BaseController.extend("com.my.zfapctaskmgmt.controller.View1", {
            formatter: formatter,
            onInit: function () {
                const oTaskModel = new JSONModel({
                    tasks: [],
                    task: {
                        taskId: "",
                        taskName: "",
                        taskDescription: "",
                        taskPriorityKey: "01",
                        taskPriority: "",
                        taskStatusKey: "01",
                        taskStatus: "",
                        creationDate: new Date()
                    },
                    user: "Jhon",
                    role: "Admin"
                });

                this.setModel(oTaskModel, "taskModel");
                this.getRouter().attachRouteMatched(this._onRouteMatched, this);
            },

            /**
             * @override
             */
            onAfterRendering() {

            },

            _onRouteMatched: function () {
                setTimeout(() => {
                    this._getTasks();
                }, 100);
            },

            //Async functions
            _getTasks: async function () {
                try {
                    BusyIndicator.show();

                    const aTasks = await TaskRepository.getAllTasks();

                    this.getModel("taskModel").setProperty("/tasks", aTasks);

                    BusyIndicator.hide();
                } catch (error) {
                    BusyIndicator.hide();
                    MessageBox.error(error.message);
                }

            },

            //Message with template string
            onPressCreate: async function () {
                try {
                    BusyIndicator.show();

                    //Destructuring
                    const { task, user } = this.getModel("taskModel").getData();
                    const { priorities } = this.getModel("priority").getData();
                    const { statusList } = this.getModel("status").getData();

                    //Optional chaining (?.)
                    console.log(task.taskOptionalChangin?.text);

                    //Spread / changing properties
                    const newTask = {
                        ...task,
                        taskPriority: priorities.find(priority => priority.key === task.taskPriorityKey).text,
                        taskStatus: statusList.find(status => status.key === task.taskStatusKey).text,
                    }

                    //Async function
                    const response = await TaskRepository.createTask(newTask);
                    const createdTask = response.task;

                    //Template Literals
                    const successMessage = `Task successfully created 
                        Name: ${createdTask.taskName}
                        Creation Date: ${createdTask.creationDate.toLocaleString()}
                    `
                    MessageBox.success(successMessage, {
                        //Arrow function
                        onClose: () => {
                            this._createTaskFragment.close();
                            this._clearForm();
                            this._getTasks()
                        }
                    })

                    BusyIndicator.hide();
                } catch (error) {
                    BusyIndicator.hide();
                    MessageBox.error(error.message);
                }
            },

            onDeleteTask: function (oEvent) {
                try {
                    BusyIndicator.show();

                    const tasksTable = this.byId("sIdTasksTable");
                    const tableItems = tasksTable.getSelectedItems();

                    tableItems.forEach(async (tableItem) => {
                        const task = tableItem.getBindingContext("taskModel")?.getObject();
                        await TaskRepository.deleteTask(task.taskId);
                    });

                    BusyIndicator.hide();

                    MessageBox.success("Tasks successfully deleted", {
                        onClose: () => this._getTasks()
                    });
                } catch (error) {
                    BusyIndicator.hide();
                    MessageBox.error(error.message);
                }
            },

            _clearForm: function () {
                const defaultForm = {
                    taskId: "",
                    taskName: "",
                    taskDescription: "",
                    taskPriorityKey: "01",
                    taskPriority: "",
                    taskStatusKey: "01",
                    taskStatus: "",
                    creationDate: new Date()
                };

                this.getModel("taskModel").setProperty("/task", defaultForm);
            },

            onPressCloseCreate: function () {
                this._createTaskFragment?.close();
            },


            //Loading fragment with async/await
            onPressCreateTask: async function () {
                const oView = this.getView();
                this._createTaskFragment ??= await Fragment.load({
                    id: oView.getId(),
                    name: `${APP_PATH}.view.fragments.CreateTask`,
                    controller: this,
                });
                oView.addDependent(this._createTaskFragment);
                this._createTaskFragment.open();
            },

            myFragment: function () {
                var oView = this.getView();
                if (!this.byId("idFragment")) {
                    // load asynchronous XML fragment
                    Fragment.load({
                        id: oView.getId(),
                        name: "com.app.view.fragments.myFragment",
                        controller: this
                    }).then(function (oFragment) {
                        // connect dialog to the root view of this component (models, lifecycle)
                        oView.addDependent(oFragment);
                        oFragment.open();
                    }.bind(this));
                } else {
                    this.byId("idFragment").open();
                }
            },

            onPressNavigateColumnListItem: function (oEvent) {
                const oTask = oEvent.getSource().getBindingContext("taskModel").getObject();
                this.getRouter().navTo("Detail", {
                    taskId: oTask.taskId
                })
            },
        });
    });
