sap.ui.define(["./BaseController", "sap/m/MessageBox"], (BaseController, MessageBox) => {
  "use strict";

  return BaseController.extend("hrmate.controller.Leave", {
    onInit() {
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView3").attachPatternMatched(this._Objectfunctionset, this);
    },
    onAfterRendering:function(){
    var sAppModulePath = "hrmate";
     this.getView().byId("listIDApplyLeave").setIcon(jQuery.sap.getModulePath(sAppModulePath) + "/image/calendar.png");   
     this.getView().byId("listIDLeaveBalance").setIcon(jQuery.sap.getModulePath(sAppModulePath) + "/image/pie-chart.png");   
  },
    listpressApplyLeave: function (oEvent) {
      // sap.ui.core.BusyIndicator.show();
      if (this.getView().getModel("maindata").getData().profile.isSound === true) {
        var audio = new Audio("./sound/mixkit-modern-technology-select-3124.wav");
        audio.play();
      }
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView11");
    },

    listpressLeaveBalance: function (oEvent) {
      // sap.ui.core.BusyIndicator.show();
      if (this.getView().getModel("maindata").getData().profile.isSound === true) {
        var audio = new Audio("./sound/mixkit-modern-technology-select-3124.wav");
        audio.play();
      }
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView5");
    },

    _Objectfunctionset:function(){
      debugger
      this._onStopBusyCard(false);
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";
      fetch(apiUrl, { method: "GET" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch employee Data");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          this.getOwnerComponent().getModel("EmailEMPData").setData(data);
          this.getOwnerComponent().getModel("EmailEMPData").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    }


  })
})