sap.ui.define(["./BaseController", "sap/m/MessageBox"], (BaseController, MessageBox) => {
  "use strict";

  return BaseController.extend("hrmate.controller.attedenceregularization", {
    onInit() {
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView7").attachPatternMatched(this._Objectfunctionset, this);
    },
    _Objectfunctionset: function () {
      debugger
      this._getAttedenceRegularizationData();
      this._onStopBusyCard(false);

    },

    onPressCreateAttedenceRegularization: function () {
      var pDialog3
      if (!pDialog3) {
        pDialog3 = this.loadFragment({
          name: "hrmate.fragments.attedenceregularization",
        });
      }
      pDialog3.then(function (oDialog3) {
        oDialog3.open()
      });
    },



    onSubmitRegularization: function (oEvent) {
      debugger
      var isValid = true, oView = this.getView();
      if (this.getView().byId("idRegularizationType").getSelectedKey() === "Missed Punch In") {
        var ids = ["idRegularizationType", "idDate", "idPunchInTime", "idReason"]
      } else if (this.getView().byId("idRegularizationType").getSelectedKey() === "Missed Punch Out") {
        var ids = ["idRegularizationType", "idDate", "idPunchOutTime", "idReason"]
      } else {
        var ids = ["idRegularizationType", "idDate", "idPunchInTime", "idPunchOutTime", "idReason"]
      }

      ids.forEach(sId => {
        var oInput = oView.byId(sId),
          sValue = oInput?.getValue?.()?.trim() || oInput?.getSelectedKey?.()?.trim();
        oInput?.setValueState(sValue ? "None" : (isValid = false, "Error"));
        oInput?.setValueStateText(sValue ? "" : "This field is required");
      });

      if (!isValid) return sap.m.MessageToast.show("Please fill all required fields.");

      var that = this;
      sap.ui.core.BusyIndicator.show();

      var oModel = this.getView().getModel("RegularizationForm").getData();
      var sEmpCode = Number($.sap.EmployeeCode);
      var payload = {
        ...oModel,
        RegularizationStatus: "Pending",
        employeecode: sEmpCode
      }

      fetch("https://regularization-api-dev.vercel.app/api/regularization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          if (data?.error) {
            sap.m.MessageToast.show("Error: " + data.error);
            oEvent.getSource().getParent().close();
            oEvent.getSource().getParent().destroy();
          } else {
            sap.m.MessageToast.show("Attedence Regularization Request submitted successfully!");
            oEvent.getSource().getParent().close();
            oEvent.getSource().getParent().destroy();
            that.getView().getModel("RegularizationForm").setData({});
            that.getView().getModel("RegularizationForm").refresh();
            that._getAttedenceRegularizationData();
          }
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },


    _getAttedenceRegularizationData: function () {
      var that = this;
      sap.ui.core.BusyIndicator.show();

      var sUrl = `https://regularization-api-dev.vercel.app/api/regularization/${$.sap.EmployeeCode}`;

      fetch(sUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
        .then(response => response.json())
        .then(RegularizationData => {
          sap.ui.core.BusyIndicator.hide();
          if (RegularizationData?.error) {
            sap.m.MessageToast.show("Error: " + RegularizationData.error);
          } else {
            that.getView().getModel("AttedenceRegularizationData").setData(RegularizationData.Results);
            that.getView().getModel("AttedenceRegularizationData").refresh(true);
           
          }
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    }







  });
});
