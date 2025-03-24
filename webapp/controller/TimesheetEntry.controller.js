sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"

], (BaseController, MessageBox) => {
    "use strict";

    return BaseController.extend("hrmate.controller.TimesheetEntry", {
        onInit: function () {
            debugger
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView13").attachPatternMatched(this._ObjectfunctionsetTimesheet, this);
        },
        _ObjectfunctionsetTimesheet: function () {
            debugger
            this._onStopBusyCard(false);
            this._onGetTimesheetData();
            this.onpressOneColumn();
        },
        onPressTimeSheetEntry: function (oEvent) {
            debugger
            oEvent.getSource().getParent().getParent().getParent().setLayout("MidColumnFullScreen")
            var sData = oEvent.getParameter("listItem").getBindingContext("TimesheetDataEMP").getObject();
            this.getOwnerComponent().getModel("selectTimesheetData").setData(sData);
        },
        onpressOneColumn: function () {
            debugger
            this.getView().byId("FlexibleColumnLayoutTimesheet").setLayout("OneColumn");
        },

        _onGetTimesheetData: function () {
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://regularization-api-dev.vercel.app/api/TimesheetEntry/" + $.sap.EmployeeCode;

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch Timesheet Data");
                    }
                    return response.json();
                })
                .then(TimesheetDataEMP => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("TimesheetDataEMP").setData(TimesheetDataEMP.Results);
                    this.getOwnerComponent().getModel("TimesheetDataEMP").refresh(true);
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },


        onSubmitTimesheetEntry: function (oEvent) {
            var aRequiredFieldIds = ["idTimesheetDate","idTimesheetStartTime","idTimesheetEndTime","idTimesheetTotalHours","idTimesheetTaskName","idTimesheetClientName"];
            var isValid;            
            aRequiredFieldIds.forEach(sId => {
                var oInput = this.getView().byId(sId),
                  sValue = oInput?.getValue?.()?.trim() || oInput?.getSelectedKey?.()?.trim();
                oInput?.setValueState(sValue ? "None" : (isValid = false, "Error"));
                oInput?.setValueStateText(sValue ? "" : "This field is required");
              });
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://regularization-api-dev.vercel.app/api/TimesheetEntry";
            var oModel = this.getView().getModel("AddtimesheetData").getData();
            var formattedDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1).toString().padStart(2, '0') + "-" + new Date().getDate().toString().padStart(2, '0') + " " + new Date().getHours().toString().padStart(2, '0') + ":" + new Date().getMinutes().toString().padStart(2, '0') + ":" + new Date().getSeconds().toString().padStart(2, '0');
            var formattedTime = new Date().toTimeString().split(' ')[0];

            var payload = {
                ...oModel,
                "employeecode": $.sap.EmployeeCode,
                "status": "Pending",
                "submissionDate": formattedDate,
                "submissionTime": formattedTime
            };


            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to save Timesheet Data");
                    }
                    return response.json();
                })
                .then(TimesheetDataEMP => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Timesheet entry saved successfully!");
                    oEvent.getSource().getParent().close();
                    oEvent.getSource().getParent().destroy();
                    this.getOwnerComponent().getModel("TimesheetDataEMP").setData(TimesheetDataEMP.Results);
                    this.getOwnerComponent().getModel("TimesheetDataEMP").refresh(true);
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },







    });
});