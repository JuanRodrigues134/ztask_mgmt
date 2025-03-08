sap.ui.define([
	"com/my/zfapctaskmgmt/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/my/zfapctaskmgmt/model/formatter",
	"com/my/zfapctaskmgmt/repository/TaskRepository",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageBox"
], function (
	BaseController,
	JSONModel,
	formatter,
	TaskRepository,
	BusyIndicator,
	MessageBox
) {
	"use strict";

	return BaseController.extend("com.my.zfapctaskmgmt.controller.Detail", {
		formatter: formatter,
		/**
		 * @override
		 */
		onInit() {
			const oDetailModel = new JSONModel({
				task: {},
				bEdit: false
			});
			this.setModel(oDetailModel, "detailModel")
			this.getRouter().getRoute("Detail").attachPatternMatched(this._onPatternMatched, this);
		},

		_onPatternMatched: async function (oEvent) {
			try {
				BusyIndicator.show();
				const { taskId } = oEvent.getParameter("arguments");
				const task = await TaskRepository.getTask(taskId);
				this.getModel("detailModel").setProperty("/task", task);
				BusyIndicator.hide();
			} catch (error) {
				BusyIndicator.hide();
				MessageBox.error(error.message);
			}
		},

		onPressEditTask: function () {
			const { bEdit } = this.getModel("detailModel").getData();
			this.getModel("detailModel").setProperty("/bEdit", !bEdit);
		},

		onPressSaveTask: async function () {
			try {
				const { task } = this.getModel("detailModel").getData();
				const { priorities } = this.getModel("priority").getData();
				const { statusList } = this.getModel("status").getData();

				const newTask = {
					...task,
					taskPriority: priorities.find(priority => priority.key === task.taskPriorityKey).text,
					taskStatus: statusList.find(status => status.key === task.taskStatusKey).text,
				}	
				
				const response = await TaskRepository.updateTasks(newTask);
				MessageBox.success(`Task ${response?.task?.taskName} Successfully updated`, {
					onClose: () => {
						this.getRouter().navTo("View1")
					}
				});
			} catch (error) {
				MessageBox.error(error.message)
			}
		},
	});
});