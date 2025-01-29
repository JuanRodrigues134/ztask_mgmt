sap.ui.define([
], function (
) {
    "use strict";
    const mStatusStateIcon = {
        "01": {
            state: "None",
            icon: "sap-icon://information",
        },
        "02": {
            state: "Information",
            icon: "sap-icon://in-progress",
        },
        "03": {
            state: "Success",
            icon: "sap-icon://sys-enter-2",
        },
        "04": {
            state: "Error",
            icon: "sap-icon://error",
        }
    }
    const formatPriorityStatus = (sKey) => {
        return !sKey ? 'None' : mStatusStateIcon[sKey].state;
    }

    const formatPriorityStatusIcon = (sKey) => {
        return !sKey ? '' : mStatusStateIcon[sKey].icon;
    }

    return { formatPriorityStatus, formatPriorityStatusIcon }
});