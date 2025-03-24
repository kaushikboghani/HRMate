sap.ui.define(["./BaseController","sap/m/MessageBox"], (BaseController,MessageBox) => {
  "use strict";

  return BaseController.extend("hrmate.controller.LeaveBalance", {
    onInit() {
      debugger;
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView12").attachPatternMatched(this._ObjectfunctiongetMaster, this);
    },
    onAfterRendering() {
        this._getLeaveBalanceDataEmployee()
        sap.ui.core.BusyIndicator.hide();
     },
     _ObjectfunctiongetMaster:function(){
      sap.ui.core.BusyIndicator.hide();
  },
     _getLeaveBalanceDataEmployee: function () {
      debugger
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" +  $.sap.EmployeeCode;

      fetch(apiUrl, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error("Failed to fetch Employee Punch history");
              }
              return response.json();
          })
          .then(LeaveBlanceDataEMP => {
              sap.ui.core.BusyIndicator.hide();
              this.getOwnerComponent().getModel("LeaveBalanceData").setData(LeaveBlanceDataEMP);
              this.getOwnerComponent().getModel("LeaveBalanceData").refresh(true);
          })
          .catch(error => {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show("Error occurred: " + error.message);
          });
  },

  onselectLeaveBalance:function(oevent){
    debugger
    this.oSelectedLeaveBalanceData = oevent.getParameter("data")[0].data
    this.getOwnerComponent().getModel("LeavebalanceSelectData").setData([this.oSelectedLeaveBalanceData]);
    this.getOwnerComponent().getModel("LeavebalanceSelectData").refresh(true);
  },

    ondeselectDataLeaveBalance:function(){
        this.getOwnerComponent().getModel("LeavebalanceSelectData").setData([]);
        this.getOwnerComponent().getModel("LeavebalanceSelectData").refresh(true);  
    }
  });
});
