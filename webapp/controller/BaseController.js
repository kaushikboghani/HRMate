sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageBox", "sap/ui/core/Fragment"], (Controller, MessageBox, Fragment) => {
  "use strict";

  return Controller.extend("hrmate.Controller.BaseController", {

    onChangeValue: function (oEvent) {
      var oControl = oEvent.getSource();
      if (oControl.isA("sap.m.Select")) {
        if (oControl.getSelectedKey()) oControl.setValueState("None");
      }
      else if (oControl.isA("sap.m.Input") || oControl.isA("sap.m.TextArea")) {
        if (oControl.getValue().trim()) oControl.setValueState("None");
      }
      else if (oControl.isA("sap.m.DatePicker")) {
        if (oControl.getDateValue()) oControl.setValueState("None");
      }
      else if (oControl.isA("sap.m.TimePicker")) {
        if (oControl.getValue().trim()) oControl.setValueState("None");
      }
    },

    onAddEMP: function (oEvent) {
      debugger
      debugger
      var pDialog3
      if (!pDialog3) {
        pDialog3 = this.loadFragment({
          name: "hrmate.fragments.newEMPAdd",
        });
      }
      pDialog3.then(function (oDialog3) {
        oDialog3.open()
      });
    },
    handleNavigationChange: function (oEvent) {
      var oWizard = this.byId("CreateProductWizard");
      oWizard.discardProgress();
      var oCurrentStep = oEvent.getParameter("step");
      var aSteps = oWizard.getSteps();
      this._iSelectedStepIndex = aSteps.indexOf(oCurrentStep);
      this._updateButtonVisibility();
    },

    onNextButtonPress: function () {
      debugger;
      if (!this._oWizard) {
        this._oWizard = this.byId("CreateProductWizard");
      }
      if (this._iSelectedStepIndex === undefined) {
        this._iSelectedStepIndex = 0;
      }
      this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
      var oNextStep = this._oWizard.getSteps()[this._iSelectedStepIndex + 1];
      if (this._oSelectedStep && !this._oSelectedStep.bLast) {
        this._oWizard.goToStep(oNextStep, true);
        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
      } else {
        this._oWizard.nextStep();
        this._iSelectedStepIndex++;
        this._oSelectedStep = oNextStep;
      }
      this._updateButtonVisibility();
    },

    onPreviousButtonPress: function () {
      debugger;
      if (!this._oWizard) {
        this._oWizard = this.byId("CreateProductWizard");
      }
      if (!this._iSelectedStepIndex) {
        this._iSelectedStepIndex = 0;
      }
      this._oSelectedStep = this._oWizard.getSteps()[this._iSelectedStepIndex];
      var oPreviousStep = this._oWizard.getSteps()[this._iSelectedStepIndex - 1];
      if (this._oSelectedStep && this._iSelectedStepIndex > 0) {
        this._oWizard.goToStep(oPreviousStep, true);
        this._iSelectedStepIndex--;
        this._oSelectedStep = oPreviousStep;
      } else {
        this._iSelectedStepIndex = 0;
        this._oWizard.goToStep(this._oWizard.getSteps()[0], true);
        this._oSelectedStep = this._oWizard.getSteps()[0];
      }
      this._updateButtonVisibility();
    },

    _updateButtonVisibility: function () {
      this._oWizard = this._oWizard || this.byId("CreateProductWizard");
      this._iSelectedStepIndex = this._iSelectedStepIndex ?? 0;
      this.byId("onBackButtonPress").setVisible(this._iSelectedStepIndex > 0);
      this.byId("nextButton").setEnabled(this._iSelectedStepIndex < 3);
      this.byId("finishButton").setEnabled(this._iSelectedStepIndex === 3);
    },

    onSelectIconTabFilter: function (oevent) {
      debugger
      if (oevent.getSource().getSelectedKey() === 'AddCalender') {

        this.getView().byId("filterbar").setShowGoButton(false);
        this.getView().byId("filterbar").setVisible(false);
      }
      else if (oevent.getSource().getSelectedKey() === 'LeaveRequests') {

        this.getView().byId("filterbar").setShowGoButton(false);
        this.getView().byId("filterbar").setVisible(false);
        this._onFetchLeaveData();

      } else if (oevent.getSource().getSelectedKey() === 'AttedenceRegularization') {
        this.getView().byId("filterbar").setShowGoButton(false);
        this.getView().byId("filterbar").setVisible(false);
        this._onFetchAttedenceRegularizationData();

      } else if (oevent.getSource().getSelectedKey() === 'TimeSheet') {
        this.getView().byId("filterbar").setShowGoButton(false);
        this.getView().byId("filterbar").setVisible(false);
        this._onGetTimesheetAllData();
      }
      else {
        this.getView().byId("filterbar").setShowGoButton(true);
        this.getView().byId("filterbar").setVisible(true);
      }
    },
    onSearchLeaveRequests: function (oEvent) {
      this.onSearchData(oEvent, "LeaveRequestTable", "employeecode");
    },
    onFilterLeaveRequests: function (oEvent) {
      this.onFilterData(oEvent, "LeaveRequestTable", "stat");
    },

    onSaveProfileFilePhoto: function (oevent) {
      debugger
      this.getView().getModel("EmployeeDetails").getData().profile.profileImage = $.sap.profileimage
      this.getView().getModel("EmployeeDetails").refresh(true)
      oevent.getSource().getParent().close()
      oevent.getSource().getParent().destroy()

    },
    onPressCloseDialog: function (oevent) {
      oevent.getSource().getParent().close()
      oevent.getSource().getParent().destroy()
    },

    onAddEMPPunchData: function (oevent) {
      debugger
      var pDialog12
      if (!pDialog12) {
        pDialog12 = this.loadFragment({
          name: "hrmate.fragments.addPunchData",
        });
      }
      pDialog12.then(function (oDialog12) {
        oDialog12.open()
      });
    },
    onSubCardPress: function (oevent) {
      debugger
      if (this.getView().getModel("maindata").getData().profile.isVibrate === true) {
        var sTileId = oevent.getSource().getId();
        if (sTileId.includes("PunchHistoryTileID")) {
          if (navigator.vibrate) {
            navigator.vibrate([300, 100, 300]);
          }
        } else {
          if (navigator.vibrate) {
            navigator.vibrate(200);
          }
        }
      }
      if (this.getView().getModel("maindata").getData().profile.isSound === true) {
       
      }
      $.sap.subTileBusy = oevent.getSource()
      this._onStopBusyCard(true)
      const oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo(oevent.getSource().getContent()[0].getFieldGroupIds()[0]);

    },
    _onStopBusyCard: function (bool) {
      debugger
      $.sap.subTileBusy.setBusy(bool);
    },

    _onGetEmployeeLeaveData: function (isCalendorController) {
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveHistory?empcode=" + $.sap.EmployeeCode;

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch Calendar Data");
          }
          return response.json();
        })
        .then(dataLeave => {
          sap.ui.core.BusyIndicator.hide();
          this.getOwnerComponent().getModel("LeaveRequestDataEmloyee").setData(dataLeave.leaveHistory);
          this.getOwnerComponent().getModel("LeaveRequestDataEmloyee").refresh(true);
          if (isCalendorController) {
            this._setPunchHistory();
          }
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
          if (isCalendorController) {
            this._setPunchHistory();
          }
        });
    },

    _onFetchLeaveData: function () {
      debugger
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveHistory";

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch Calendar Data");
          }
          return response.json();
        })
        .then(dataLeave => {
          sap.ui.core.BusyIndicator.hide();
          this.getOwnerComponent().getModel("LeaveRequestData").setData(dataLeave.leaveHistories);
          this.getOwnerComponent().getModel("LeaveRequestData").refresh(true);
          var pendingCount = dataLeave.leaveHistories.filter(item => item.stat === "Pending").length;
          this.getView().byId("LeaveRequestsTab").setCount(pendingCount);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },
    onFilterStatus: function (oEvent) {
      var sKey = this.getView().byId("Segmentedfilteremployee").getSelectedKey();
      var oBinding = this.getView().byId("AppliedLeavesTable").getBinding("items");
      var aFilters = sKey !== "All" ? [new sap.ui.model.Filter("stat", sap.ui.model.FilterOperator.EQ, sKey)] : [];
      oBinding.filter(aFilters);
    },

    /////////////////////////////////Attedence Regularization //////////////////////////////////////
    onSearchAttedenceRegularizationEMPData: function (oEvent) {
      this.onSearchData(oEvent, "AttedenceRegularizationDataTable", "employeecode");
    },
    onFilterAttedenceRegularizationEMPData: function (oEvent) {
      this.onFilterData(oEvent, "AttedenceRegularizationDataTable", "RegularizationStatus");
    },

    _onFetchAttedenceRegularizationData: function () {
      debugger
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://regularization-api-dev.vercel.app/api/regularization";

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch Attedence Regularization Data");
          }
          return response.json();
        })
        .then(AttedenceRegularizationEMPData => {
          sap.ui.core.BusyIndicator.hide();
          this.getOwnerComponent().getModel("AttedenceRegularizationEMPData").setData(AttedenceRegularizationEMPData.Results);
          this.getOwnerComponent().getModel("AttedenceRegularizationEMPData").refresh(true);
          var pendingCount = AttedenceRegularizationEMPData.Results.filter(item => item.RegularizationStatus === "Pending").length;
          this.getView().byId("AttedenceRegularizationTab").setCount(pendingCount);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },



    onPressAddCertificates: function (oEvent) {
      var pDialogCertificates;
      $.sap.oPath = Number(oEvent?.getSource()?.getBindingContext("certificates")?.getPath().split("/").pop());
      if (!pDialogCertificates) {
        pDialogCertificates = this.loadFragment({
          name: "hrmate.fragments.Certificates",
        });
      }
      pDialogCertificates.then(function (oDialogCertificates) {
        oDialogCertificates.open();
      });
    },
    onPressupdateCertificates: function (oEvent) {
      var pDialogCertificates;
      $.sap.oPath = Number(oEvent?.getSource()?.getBindingContext("certificates")?.getPath().split("/").pop());
      if (!pDialogCertificates) {
        pDialogCertificates = this.loadFragment({
          name: "hrmate.fragments.editCertificates",
        });
      }
      pDialogCertificates.then(function (oDialogCertificates) {
        oDialogCertificates.bindElement(`certificates>/${$.sap.oPath}`)
        oDialogCertificates.open();
      });
    },


    //////////////////////////filter data//////////////////////////////////////////////////////////
    onFilterData: function (oEvent, sTableId, sFilterField) {
      var sKey = oEvent.getSource().getSelectedKey();
      var oTable = this.getView().byId(sTableId);
      var oBinding = oTable.getBinding("items");
      var aFilters = sKey !== "All" ? [new sap.ui.model.Filter(sFilterField, sap.ui.model.FilterOperator.EQ, sKey)] : [];
      oBinding.filter(aFilters);
    },

    onSearchData: function (oEvent, sTableId, sSearchField) {
      var sQuery = oEvent.getSource().getValue();
      var oTable = this.getView().byId(sTableId);
      var oBinding = oTable.getBinding("items");
      var ofilternumber = !isNaN(sQuery) ? Number(sQuery) : sQuery
      var aFilters = [];
      (sQuery && aFilters.push(new sap.ui.model.Filter(sSearchField, sap.ui.model.FilterOperator.EQ, ofilternumber)))
      oBinding.filter(aFilters);
    },

    onValueHelpRequest: function (oEvent) {
      debugger
      this.oInputFilter = oEvent.getSource()
      this.spath = "profile/" + oEvent.getSource().getParent().getProperty("name");

      if (!this.CustomerCodeFragment) {
        this.CustomerCodeFragment = sap.ui.xmlfragment("hrmate.fragments.valueHelpDialogFilter", this);
        this.CustomerCodeFragment.setTitle("Select " + oEvent.getSource().getLabels()[0].mProperties.text);
        var oTemplate = new sap.m.StandardListItem({
          title: "{EMPData>" + this.spath + "}",
          type: "Active"
        });

        this.CustomerCodeFragment.bindAggregation("items", {
          path: "EMPData>/",
          template: oTemplate
        });
        this.getView().addDependent(this.CustomerCodeFragment);
      }
      this.CustomerCodeFragment.open();
    },
    onSelectValue: function (oEvent) {
      this.oInputFilter.setValue(oEvent.getParameter("selectedItem").getTitle());
      oEvent.getSource().destroy();
      this.CustomerCodeFragment = undefined;
      this.oInputFilter = undefined;
      this.spath = undefined;
    },
    onDialogClose: function (oEvent) {
      var oDialog = oEvent.getSource();
      this.CustomerCodeFragment = undefined;
      this.spath = undefined;
      oDialog.destroy();
    },


    onGoFilter: function (oEvent) {
      var oFilterModel = this.getView().getModel("FilterModel").getData();
      var oBinding = this.getView().byId("EMPData").getBinding("items");
      var aFilters = [];
      if (oFilterModel.FirstName) {
        aFilters.push(new sap.ui.model.Filter("profile/firstName", sap.ui.model.FilterOperator.Contains, oFilterModel.FirstName));
      }
      if (oFilterModel.LastName) {
        aFilters.push(new sap.ui.model.Filter("profile/lastName", sap.ui.model.FilterOperator.Contains, oFilterModel.LastName));
      }
      if (oFilterModel.Email) {
        aFilters.push(new sap.ui.model.Filter("profile/Email", sap.ui.model.FilterOperator.Contains, oFilterModel.Email));
      }
      if (oFilterModel.Designation) {
        aFilters.push(new sap.ui.model.Filter("profile/Designation", sap.ui.model.FilterOperator.Contains, oFilterModel.Designation));
      }
      oBinding.filter(aFilters);
      sap.m.MessageToast.show("Filters Applied Successfully!");
    },
    onClearFilter: function () {
      this.getView().getModel("FilterModel").setData({ "FirstName": "", "LastName": "", "Email": "", "Designation": "", "EmployeeCode": "" });
      sap.m.MessageToast.show("Filters Cleared Successfully!");
      this.onGoFilter();
    },


    onLiveChange: function (oEvent) {
      var sValue = oEvent.getParameter("value");
      var oBinding = oEvent.getSource().getBinding("items");

      if (!sValue) {
        oBinding.filter([]);
        return;
      }
      var oFilter = new sap.ui.model.Filter({
        path: this.spath,
        operator: sap.ui.model.FilterOperator.Contains,
        value1: sValue
      });
      oBinding.filter([oFilter]);
    },

    ///////////////////////////////Timesheet Entry/////////////////////////////////////////////

    _onGetTimesheetAllData: function (oevent) {
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://regularization-api-dev.vercel.app/api/TimesheetEntry";

      fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch Employee Timesheet Data");
          }
          return response.json();
        })
        .then(TimesheetDataAll => {
          sap.ui.core.BusyIndicator.hide();
          this.getOwnerComponent().getModel("TimeSheetAllData").setData(TimesheetDataAll.Results);
          this.getOwnerComponent().getModel("TimeSheetAllData").refresh(true);
          var pendingCount = TimesheetDataAll.Results.filter(item => item.status === "Pending").length;
          this.getView().byId("TimeSheetTab").setCount(pendingCount);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },

    onPressCreateTimesheetEntry: function () {
      debugger
      var pDialogTimesheet;
      if (!pDialogTimesheet) {
        pDialogTimesheet = this.loadFragment({
          name: "hrmate.fragments.TimesheetEntry",
        });
      }
      pDialogTimesheet.then(function (oDialogTimesheet) {
        oDialogTimesheet.open();
      });
    },

    onSearchTimeSheetAllDataEMPData: function (oEvent) {
      this.onSearchData(oEvent, "TimeSheetDataTable", "employeecode");
    },
    onFilterTimeSheetAllDataFilterEMPData: function (oEvent) {
      this.onFilterData(oEvent, "TimeSheetDataTable", "status");
    },
    onPressMoreTimeSheetData: function (oEvent) {
      debugger
      var oView = this.getView();
      var oButton = oEvent.getSource();

      if (!this._oPopover) {
        this.loadFragment({
          name: "hrmate.fragments.adminLinkTimesheetData",
          controller: this
        }).then(function (oPopover) {
          this._oPopover = oPopover;
          oView.addDependent(this._oPopover);
          this._oPopover.openBy(oButton);
        }.bind(this));
      } else {
        this._oPopover.openBy(oButton);
      }
      var oLinkData = oEvent.getSource().getBindingContext("TimeSheetAllData").getObject();
      this.getOwnerComponent().getModel("PopoverTimeSheetData").setData(oLinkData);
      this.getOwnerComponent().getModel("PopoverTimeSheetData").refresh(true);
    },


    ///////////////////////////////////////////////home page///////////////////////////////////





    onPressAppSetting: function (oEvent) {
      debugger
      var pDialog3
      if (!pDialog3) {
        pDialog3 = this.loadFragment({
          name: "hrmate.fragments.settingDialog",
        });
      }
      pDialog3.then(function (oDialog3) {
        oDialog3.open()
      });

    }
  });
});
