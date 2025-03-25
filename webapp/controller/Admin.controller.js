sap.ui.define(["./BaseController", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator" , "sap/ui/core/Messaging",
	"sap/ui/core/message/Message",
], (BaseController, MessageBox, Fragment, Filter, FilterOperator,Messaging,Message) => {
  "use strict";

  return BaseController.extend("hrmate.controller.Admin", {
    onInit() {
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView10").attachPatternMatched(this._ObjectfunctiongetMaster, this);

    },
    _ObjectfunctiongetMaster: function (oEvent) {
      debugger
      if (oEvent.getParameter("name") !== "RouteView10") {
        return;
      }
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

          data.forEach((element, i) => {
            if ($.sap.EmployeeCode == element.EmployeeCode) {
              data.splice(i, 1)
            }
          });
          this.getOwnerComponent().getModel("EMPData").setData(data);
          this.getOwnerComponent().getModel("EMPData").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });

      this.onFetchCalendarData();
      this._onFetchLeaveData()
      this._onFetchAttedenceRegularizationData()
      this._onGetTimesheetAllData();
    },

    onFetchCalendarData: function () {
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/calendar";

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
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          var oCalendar = this.getView().byId("AddCalendor");
          oCalendar.removeAllSpecialDates();

          var aHolidays = data.data;
          aHolidays.forEach(function (entry) {
            var oSpecialDate = new sap.ui.unified.DateTypeRange({
              startDate: new Date(entry.date),
              type: entry.type.toLowerCase() === "holiday"
                ? sap.ui.unified.CalendarDayType.Type06
                : sap.ui.unified.CalendarDayType.NonWorking
            });
            oCalendar.addSpecialDate(oSpecialDate);
          });


          this.getOwnerComponent().getModel("MasterDataHoliday").setData(data.data);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },

    onPressDetailsEMP: function (oEvent) {
      debugger
      sap.ui.core.BusyIndicator.show();
      var opath = Number(oEvent.getSource().getBindingContext("EMPData").getPath().split("/").pop())
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("RouteView9", {
        index: opath
      });


    },
    onFileChange: function (oEvent) {
      debugger
      var oFile = oEvent.getParameter('files')[0];
      var that = this
      if (oFile) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var base64String = e.target.result;
          $.sap.profileimage = base64String
          that.base64()
        };
        reader.readAsDataURL(oFile);

      }

    },

    base64: function (oevent) {
      debugger
      this.getView().getModel("addPaylodEMP").getData().profileImage = $.sap.profileimage
      this.getView().getModel("addPaylodEMP").refresh(true)

    },
    onCloseDialogWizard: function (oEvent) {
      debugger
      this._iSelectedStepIndex = undefined;
      this._oWizard = undefined;
      this._oSelectedStep = undefined;
      this._oSelectedStepIndex = undefined;
      oEvent.getSource().getParent().getParent().getParent().close()
      oEvent.getSource().getParent().getParent().getParent().destroy()
    },




    onAddDetails: function (oEvent) {
      debugger;

      // var aRequiredFields = [
      //   "EmployeeCodeID", "FirstNameID", "LastNameID", "DateofBirthID",
      //   "GenderID", "MaritalStatusID", "PasswordID", "MobileNumberID",
      //   "EmailID", "PANNumberID", "AadhaarNumberID", "DesignationID",
      //   "BranchID", "RoleID", "DateofJoiningID", "ReportingManagerID",
      //   "ApprovingManagerID", "BankNameID", "BankAccountNumberID",
      //   "BankIFSCCodeID"
      // ];

      // var isValid = true;

      // aRequiredFields.forEach(function (sId) {
      //   var oInput = this.getView().byId(sId);
      //   if (oInput && oInput.getValue) {
      //     var sValue = oInput.getValue().trim();
      //     if (!sValue) {
      //       oInput.setValueState("Error");
      //       oInput.setValueStateText("This field is required");
      //       isValid = false;
      //     } else {
      //       oInput.setValueState("None");
      //     }
      //   }
      // }, this);


      // if (!isValid) return sap.m.MessageToast.show("Please fill all required fields.");

      // Messaging.removeAllMessages();
      // var oModel = this.getView().getModel("addPaylodEMP")
      // var isValid = true;
      // var aRequiredFields = [
      //   "firstName", "lastName", "DateOfBirth", "Gender", "MaritalStatus", "Password",
      //   "MobileNumber", "Email", "PANNumber", "AadhaarNumber", "Designation", "Branch",
      //   "role", "DateofJoining", "ReportingManager", "ApprovingManager", "BankName",
      //   "BankAccountNumber", "BankIFSCCode"
      // ];
      // aRequiredFields.forEach(property => {
      //   if (!oModel.getData()[property]?.trim()) {
      //     isValid = false;
      //     Messaging.addMessages(new sap.ui.core.message.Message({
      //       message: property +  " field is required",
      //       type: sap.ui.core.MessageType.Error,
      //       target: `/${property}`,
      //       processor: oModel
      //     }));
      //   }
      // });

      // if (!isValid) return sap.m.MessageToast.show("Please fill all required fields.");

      var EMPID = Number(this.getView().byId("EmployeeCodeID").getValue());
      var oModel = this.getOwnerComponent().getModel("addPaylodEMP").getData();
      var deductions = {
        description: oModel.description || "",
        amount: oModel.amount != null ? oModel.amount : 0,
        name: oModel.name || ""
      };

      delete oModel.description;
      delete oModel.amount;
      delete oModel.name;

      var payload = {
        "EmployeeCode": EMPID,
        "profile": { ...oModel },
        "deductions": deductions
      };
      payload.profile.salary = parseInt(payload.profile.salary) || 0;

      function formatDateString(dateStr) {
        if (!dateStr) return null;
        var parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return null;
      }

      payload.profile.DateOfBirth = formatDateString(payload.profile.DateOfBirth);
      payload.profile.hireDate = formatDateString(payload.profile.hireDate);
      payload.profile.DateofJoining = formatDateString(payload.profile.DateofJoining);
      payload.profile.DateofConfirmation = formatDateString(payload.profile.DateofConfirmation);

      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(err => { throw new Error(JSON.stringify(err)); });
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Employee Added Successfully");
          oEvent.getSource().getParent().getParent().getParent().close();
          oEvent.getSource().getParent().getParent().getParent().destroy();
          this.getOwnerComponent().getModel("EMPData").setData(data.data);
          this.getOwnerComponent().getModel("EMPData").refresh(true);
          this.getOwnerComponent().getModel("addPaylodEMP").setData({});
          this.getOwnerComponent().getModel("addPaylodEMP").refresh(true);

        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },

    onDeleteEMPDetails: function (oEvent) {
      debugger;
      let aSelectedItems = this.byId("EMPData").getSelectedItems();

      if (aSelectedItems.length === 0) {
        sap.m.MessageBox.error("Please select items to delete.");
        return;
      }

      let sEmployeeCode = Number(aSelectedItems[0].getBindingContext("EMPData").getObject("EmployeeCode"));
      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + sEmployeeCode;

      sap.m.MessageBox.confirm("Are you sure you want to delete the selected item?", {
        title: "Confirm Deletion",
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        emphasizedAction: sap.m.MessageBox.Action.YES,
        onClose: (sAction) => {
          if (sAction === sap.m.MessageBox.Action.YES) {
            sap.ui.core.BusyIndicator.show();

            fetch(apiUrl, { method: "DELETE" })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Failed to delete selected items.");
                }
                return response.json();
              })
              .then((data) => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Selected items deleted successfully.");
                this.getOwnerComponent().getModel("EMPData").setData(data.data);
                this.getOwnerComponent().getModel("EMPData").refresh(true);              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          }
        }
      });
    },


    onSearchfield: function (oEvent) {
      this.onSearchData(oEvent, "EMPData", "EmployeeCode");
    },


   


    onSelectAddDate: function (oEvent) {
      var sSelectedDate = oEvent.getSource().getSelectedDates()[0].getStartDate();
      var aHolidays = this.getOwnerComponent().getModel("MasterDataHoliday").getData();
      var year = sSelectedDate.getFullYear();
      var month = String(sSelectedDate.getMonth() + 1).padStart(2, "0");
      var day = String(sSelectedDate.getDate()).padStart(2, "0");
      var formattedDate = `${year}-${month}-${day}`;
      var oSelectedEntry = aHolidays.find(entry => entry.date === formattedDate);
      if (oSelectedEntry) {
        this.getOwnerComponent().getModel("addDateTypeModel").setData({
          "date": formattedDate,
          "type": oSelectedEntry.type,
          "name": oSelectedEntry.name
        });
      } else {
        this.getOwnerComponent().getModel("addDateTypeModel").setData({
          "date": formattedDate,
          "type": "",
          "name": ""
        });
      }

      this.getOwnerComponent().getModel("addDateTypeModel").refresh(true);
    },


    OndateTypeAdd: function () {
      debugger;
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/calendar";
      var payload = this.getOwnerComponent().getModel("addDateTypeModel").getData();

      if (!payload.date || !payload.type || !payload.name) {
        sap.ui.core.BusyIndicator.hide();
        sap.m.MessageBox.error("All fields (Date, Day Type, and Day Name) are required.");
        return;
      }

      var dateParts = payload.date.split("-");
      if (dateParts.length === 3) {
        var day = dateParts[2];
        var month = dateParts[1];
        var year = dateParts[0];
        payload.date = `${year}-${month}-${day}`;
      }

      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to add Calendar Data");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Date Entry Added");
          this.getView().getModel("addDateTypeModel").setData({
            "date": "",
            "type": "",
            "name": "",
          });
          this.getView().getModel("addDateTypeModel").refresh();
          this.getView().byId("AddCalendor").removeAllSelectedDates();
          this.onFetchCalendarData();
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },

    handleLeaveAction: function (oEvent) {
      debugger;
      var Oobject = oEvent.getSource().getBindingContext("LeaveRequestData").getObject();
      var that = this;
      var actionType = oEvent.getSource().getText();
      var confirmationMessage = actionType === "Approve"
        ? "Are you sure you want to approve this leave?"
        : "Are you sure you want to reject this leave?";

      sap.m.MessageBox.confirm(confirmationMessage, {
        title: "Confirm " + actionType,
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === sap.m.MessageBox.Action.YES) {
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveHistory?id=" +
              Oobject._id + "&empcode=" + Oobject.employeecode;
            var updatePayload = {
              "stat": actionType,
              "employeeCode": Number(Oobject.employeecode)
            };

            fetch(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatePayload)
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Failed to update leave status");
                }
                return response.json();
              })
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Leave " + actionType + "Successfully");
                that._onFetchLeaveData();
                if (actionType === "Approve") {
                  that._onCutLeaves(Oobject);
                }
                that._sendEmailActiontakeLeave(actionType, Oobject);
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
                that._sendEmailActiontakeLeave(actionType, Oobject);
              });
          }
        }
      });
    },

    _onCutLeaves: function (Oobject) {
      var that = this;
      var fetchUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + Oobject.employeecode;
      sap.ui.core.BusyIndicator.show();

      fetch(fetchUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch leave balance");
          }
          return response.json();
        })
        .then(data => {
          let leaveEntry = data.find(item => item.type === Oobject.LeaveType)
          var updatePayload = {
            "type": Oobject.LeaveType,
            "days": Math.max(0, leaveEntry.days - Oobject.TotalLeaveDay)
          };

          var updateUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + Oobject.employeecode;

          return fetch(updateUrl, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatePayload)
          });
        })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to update leave balance");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Leave balance updated successfully.");
          that._onFetchLeaveData();
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error updating leave balance: " + error.message);
        });
    },

    _sendEmailActiontakeLeave: function (actionType, Oobject) {
      debugger
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://regularization-api-dev.vercel.app/api/ReplyEmail";
      var payload = {
        ...Oobject,
        "actionType": actionType,
        "ActionByFirstName": this.getOwnerComponent().getModel("maindata").getData().profile.firstName,
        "ActionByLastName": this.getOwnerComponent().getModel("maindata").getData().profile.lastName,
        "ActionByEmail": this.getOwnerComponent().getModel("maindata").getData().profile.Email,
        "ActionByCode": this.getOwnerComponent().getModel("maindata").getData().EmployeeCode
      }
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to send email");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show(`E-mail sent successfully: Leave ${actionType}`);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },


    ////////////////////////////////////handleAttedenceRegularization//////////////////////////
    handleAttedenceRegularization: function (oEvent) {
      debugger;
      var Oobject = oEvent.getSource().getBindingContext("AttedenceRegularizationEMPData").getObject();
      var that = this;
      var actionType = oEvent.getSource().getText();
      var confirmationMessage = actionType === "Approve"
        ? "Are you sure you want to approve this Attedence Regularization Request?"
        : "Are you sure you want to reject this Attedence Regularization Request?";

      sap.m.MessageBox.confirm(confirmationMessage, {
        title: "Confirm " + actionType,
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === sap.m.MessageBox.Action.YES) {
            sap.ui.core.BusyIndicator.show();

            var apiUrl = `https://regularization-api-dev.vercel.app/api/regularization/${Oobject.employeecode}`;
            var updatePayload = {
              "_id": Oobject._id,
              "RegularizationStatus": actionType,
              "employeecode": Number(Oobject.employeecode)
            };

            fetch(apiUrl, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatePayload)
            })
              .then(response => response.json())
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                if (data?.error) {
                  sap.m.MessageToast.show("Error: " + data.error);
                } else {
                  sap.m.MessageToast.show("Attedence Regularization " + actionType + "Successfully!");
                  if (actionType === "Approve") {
                    that._updatePunchHistory(Oobject);
                  }
                  that._onFetchAttedenceRegularizationData();
                }
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          }
        }
      });
    },

    _updatePunchHistory: function (Oobject) {
      sap.ui.core.BusyIndicator.show();

      let apiUrl = `https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=${Oobject.employeecode}`;
      let requestMethod;
      let updatePayload;

      if (Oobject.RegularizationType === "Missed Punch In") {
        requestMethod = "PUT";
        updatePayload = {
          "date": Oobject.RegularizationDate,
          "punchIn": Oobject.RegularizationPunchInTime,
          "Inaddress": "A-701 & A-702, Siddhi Vinayak Towers, Off Sarkhej - Gandhinagar Hwy, near Kataria Arcade, Makarba, Ahmedabad, Gujarat 380051"
        };
      } else if (Oobject.RegularizationType === "Missed Punch Out") {
        requestMethod = "PUT";
        updatePayload = {
          "date": Oobject.RegularizationDate,
          "punchOut": Oobject.RegularizationPunchOutTime,
          "Outaddress": "A-701 & A-702, Siddhi Vinayak Towers, Off Sarkhej - Gandhinagar Hwy, near Kataria Arcade, Makarba, Ahmedabad, Gujarat 380051"
        };
      } else if (Oobject.RegularizationType === "Missed Both") {
        requestMethod = "POST";
        updatePayload = {
          "date": Oobject.RegularizationDate,
          "punchIn": Oobject.RegularizationPunchInTime,
          "Inaddress": "A-701 & A-702, Siddhi Vinayak Towers, Off Sarkhej - Gandhinagar Hwy, near Kataria Arcade, Makarba, Ahmedabad, Gujarat 380051",
          "punchOut": Oobject.RegularizationPunchOutTime,
          "Outaddress": "A-701 & A-702, Siddhi Vinayak Towers, Off Sarkhej - Gandhinagar Hwy, near Kataria Arcade, Makarba, Ahmedabad, Gujarat 380051"
        };
      } else {
        sap.ui.core.BusyIndicator.hide();
        sap.m.MessageToast.show("Invalid Regularization Type");
        return;
      }

      fetch(apiUrl, {
        method: requestMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to ${requestMethod === "PUT" ? "update" : "create"} punch history`);
          }
          return response.json();
        })
        .then(() => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show(`Punch History ${requestMethod === "PUT" ? "Updated" : "Created"} Successfully`);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },
    /////////////////////////////////////////Tiemsheet Entry//////////////////////////////////// 



    handleTimesheetEntry: function (oEvent) {
      var oObject = oEvent.getSource().getBindingContext("TimeSheetAllData").getObject();
      var that = this;
      var actionType = oEvent.getSource().getText();
      var confirmationMessage = actionType === "Approve"
        ? "Are you sure you want to approve this timesheet?"
        : "Are you sure you want to reject this timesheet?";

      sap.m.MessageBox.confirm(confirmationMessage, {
        title: "Confirm " + actionType,
        actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
        onClose: function (oAction) {
          if (oAction === sap.m.MessageBox.Action.YES) {
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://regularization-api-dev.vercel.app/api/TimesheetEntry/" + oObject.employeecode;
            var updatePayload = {
              "status": actionType,
              "_id": oObject._id
            };

            fetch(apiUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(updatePayload)
            })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Failed to update Emoployee timesheet status");
                }
                return response.json();
              })
              .then(TimesheetDataAll => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Timesheet " + actionType + " successfully");
                that.getOwnerComponent().getModel("TimeSheetAllData").setData(TimesheetDataAll.Results);
                that.getOwnerComponent().getModel("TimeSheetAllData").refresh(true);
                var pendingCount = TimesheetDataAll.Results.filter(item => item.status === "Pending").length;
                that.getView().byId("TimeSheetTab").setCount(pendingCount);
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          }
        }
      });
    }

  });
});
