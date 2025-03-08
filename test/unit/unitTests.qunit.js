/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"comvesi/zfapc_task_mgmt/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
