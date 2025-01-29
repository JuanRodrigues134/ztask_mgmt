sap.ui.define([
    "com/my/zfapctaskmgmt/model/indexDbManager"
], function (
    indexDbManager
) {
    "use strict";
    const createTask = async (task) => {
        try {
            if (!task.taskName) throw new Error('Name is mandatory');

            const { taskName, creationDate } = task;

            //interpolation / template literals
            task.taskId = `${window.btoa(taskName)}-${creationDate.getTime()}`;

            await indexDbManager.addObjectStore("tasks", task);

            //spread/rest operator
            const { taskId, ...rest } = task;

            return {
                task: rest
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const getAllTasks = async () => {
        try {
            return await indexDbManager.getAllObjectStore("tasks");
        } catch (error) {
            throw new Error("Error when loading tasks");
        }
    }

    const getTask = async (taskId) => {
        try {
            return await indexDbManager.getObjectStore("tasks", taskId);
        } catch (error) {
            throw new Error("Error when retreiving task by ID");
        }
    }

    const updateTasks = async (task) => {
        try {
            await indexDbManager.putObjectStore("tasks", task);

            return {
                task
            }
        } catch (error) {
            throw new Error("Error when updating task");
        }
    }

    const deleteTask = async (taskId) => {
        try {
            await indexDbManager.removeObjectStore("tasks", taskId);

            return {
                message: "Task successfuly deleted"
            }
        } catch (error) {
            throw new Error("Error when updating task");
        }
    }

    return {
        createTask,
        getAllTasks,
        getTask,
        updateTasks,
        deleteTask
    }
});