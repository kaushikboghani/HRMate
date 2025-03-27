sap.ui.define([
  "./BaseController",
  "sap/m/MessageBox"

], (BaseController, MessageBox) => {
  "use strict";

  return BaseController.extend("hrmate.controller.View1", {
    onInit: function () {
      debugger

      sap.ui.core.BusyIndicator.hide();
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView1").attachPatternMatched(this._Objectfunctionset, this);
    },
    onAfterRendering: function () {
      var sAppModulePath = "hrmate";
      this.getView().byId("PunchInTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Enter.png");
      this.getView().byId("PunchOutTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Exit.png");
      if (this.getOwnerComponent().getModel("maindata").getData().profile.Gender === 'Male') {
        this.getView().byId("ProfileTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/office-man.png");
      } else if (this.getOwnerComponent().getModel("maindata").getData().profile.Gender === 'Female') {
        this.getView().byId("ProfileTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/office-woman.png");
      } else {
        this.getView().byId("ProfileTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/user.png");
      }
      this.getView().byId("PayslipTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/payslip.png");
      this.getView().byId("CalendarTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/schedule.png");
      this.getView().byId("LeaveManagementTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/leave.png");
      this.getView().byId("PunchHistoryTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/order-history.png");
      this.getView().byId("CertificatesTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Certificates.png");
      this.getView().byId("TimesheetTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Timesheet.png");

    },
    _Objectfunctionset: function (oEvent) {
      // this._onFetchCalendarDataPunchCheck();
      debugger
      if (oEvent.getParameter("name") !== "RouteView1") {
        return;
      }
      sap.ui.core.BusyIndicator.show();
      var today = new Date();
      var formattedToday = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;
      fetch(apiUrl, { method: "GET" })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch punch history");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          var punchHistory = data.punchHistory || [];
          for (var z = 0; z < punchHistory.length; z++) {
            if (punchHistory[z].date === formattedToday) {
              if (punchHistory[z].punchIn) {
                this.getView().byId("puchin").addStyleClass("tile-punchin");
                this.getView().byId("puchin").setPressEnabled(false);
                this.getView().byId("puchin").setHeader(punchHistory[z].punchIn);
              } else {
                this.getView().byId("puchin").removeStyleClass("tile-punchin");
                this.getView().byId("puchin").setPressEnabled(true);
              }
              if (punchHistory[z].punchOut) {
                this.getView().byId("punchout").addStyleClass("tile-punchout");
                this.getView().byId("punchout").setPressEnabled(false);
                this.getView().byId("punchout").setHeader(punchHistory[z].punchOut);
              } else {
                this.getView().byId("punchout").removeStyleClass("tile-punchout");
                this.getView().byId("punchout").setPressEnabled(true);
              }
              break;
            }
          }

        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);
        });
    },
    onPunchIn: function (oEvent) {
      var that = this;
      sap.ui.core.BusyIndicator.show();

      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            $.sap.currentAddress = data.display_name || "Location not found";
            var punchApiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;

            var today = new Date();
            var year = today.getFullYear();
            var month = String(today.getMonth() + 1).padStart(2, "0");
            var day = String(today.getDate()).padStart(2, "0");
            $.sap.formattedDatein = `${year}-${month}-${day}`;
            $.sap.formattedTimein = today.toLocaleTimeString("en-US", { hour12: true });


            var payload = {
              "date": $.sap.formattedDatein,
              "punchIn": $.sap.formattedTimein,
              "Inaddress": $.sap.currentAddress,
              "punchOut": "",
              "Outaddress": "",
            };

            fetch(punchApiUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            })
              .then(response => response.json())
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                oEvent.getSource().addStyleClass("tile-punchin");
                oEvent.getSource().setPressEnabled(false);
                oEvent.getSource().setHeader($.sap.formattedTimein);
                sap.m.MessageToast.show("Punch In Recorded Successfully");
                $.sap.punchID = data.punchHistory._id;
                localStorage.setItem("punchID", $.sap.punchID);
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          })
          .catch(error => {
            sap.ui.core.BusyIndicator.hide();
            sap.m.MessageToast.show("Failed to fetch location.");
          });

      }, function (error) {
        sap.ui.core.BusyIndicator.hide();
        sap.m.MessageToast.show("Location access denied or unavailable.");
      });
    },

    onPunchOut: function (oEvent) {
      var today = new Date();
      sap.ui.core.BusyIndicator.show();
      var formattedTimeout = today.toLocaleTimeString("en-US", { hour12: true });

      navigator.geolocation.getCurrentPosition(async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        $.ajax({
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          method: "GET",
          success: function (response) {
            let outAddress = response.display_name || "Location not found";
            var spunchID = localStorage.getItem("punchID");

            let apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?punchHistoryId=" +
              spunchID + "&employeeCode=" + $.sap.EmployeeCode;
            // var formattedDateout = today.toLocaleDateString("en-GB").split("/").join("-");
            var updatePayload = {
              "punchOut": formattedTimeout,
              "Outaddress": outAddress,
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
                  throw new Error("Failed to update punch-out time");
                }
                return response.json();
              })
              .then(data => {
                sap.ui.core.BusyIndicator.hide();
                console.log("Punch Out Response Data:", data);
                oEvent.getSource().addStyleClass("tile-punchout");
                oEvent.getSource().setPressEnabled(false);
                oEvent.getSource().setHeader(formattedTimeout);
                sap.m.MessageToast.show("Punch Out Recorded Successfully");
              })
              .catch(error => {
                sap.ui.core.BusyIndicator.hide();
                sap.m.MessageToast.show("Error occurred: " + error.message);
              });
          },
          error: function (error) {
            sap.ui.core.BusyIndicator.hide();
            console.log("Error:", error);
            sap.m.MessageToast.show("Failed to fetch location.");
          }
        });
      });
    },

    ////////////////////////setting///////////////////////////////////////////////

    onPressSettingItems: function (oEvent) {
      debugger
      if (this.getView().getModel("maindata").getData().profile.isSound === true) {
        var audio = new Audio("./sound/mixkit-modern-technology-select-3124.wav");
        audio.play();
      }
      oEvent.getSource().getParent().getParent().getParent().setLayout("MidColumnFullScreen")
      this.getView().byId("midColumnPagesSettingId").setTitle(oEvent.getParameter("listItem").getTitle())
      this.getView().getModel("settingInputsModel").setProperty("/selectedSetting", oEvent.getParameter("listItem").getTitle());
    },
    onPressNavBackSetting: function (oEvent) {
      oEvent.getSource().getParent().getParent().setLayout("OneColumn")
    },

    onToggleSoundandVibrate: function (oEvent) {
      oEvent.getSource().setBusy(true);
      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EmployeeCode;
      let updatePayload = {
        "profile": {
          "isSound": this.getView().byId("soundSwitch").getState(),
          "isVibrate": this.getView().byId("vibrationSwitch").getState()
        }
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
            throw new Error("Failed to Update Settings ");
          }
          return response.json();
        })
        .then(data => {
          oEvent.getSource().setBusy(false);
          sap.m.MessageToast.show("Settings Updated Successfully");
          let message = "";
          if (soundState && vibrationState) {
            message = "Sound and Vibration Enabled";
          } else if (!soundState && !vibrationState) {
            message = "Sound and Vibration Disabled";
          } else if (soundState) {
            message = "Sound Enabled, Vibration Disabled";
          } else {
            message = "Vibration Enabled, Sound Disabled";
          }
          sap.m.MessageToast.show(message);
          this.getOwnerComponent().getModel("maindata").setData(data.Results);
          this.getOwnerComponent().getModel("maindata").refresh(true);
        })
        .catch(error => {
          oEvent.getSource().setBusy(false);
          sap.m.MessageToast.show("Error: " + error.message);
        });
    },


    onPressSettingPaasswordUpdate: function () {
      debugger;
      var isValid = true;
      ["passwordInput", "confirmPasswordInput"].forEach(id =>
        this.getView().byId(id).setValueState(this.getView().byId(id).getValue().trim() ? "None" : (isValid = false, "Error"))
      );
      if (!isValid) return sap.m.MessageToast.show("Please fill all required fields.");

      if (this.getView().byId("passwordInput").getValue().trim() !== this.getView().byId("confirmPasswordInput").getValue().trim()) {
        ["passwordInput", "confirmPasswordInput"].forEach(id => this.getView().byId(id).setValueState("Error"));
        return sap.m.MessageToast.show("Passwords do not match.");
      }

      sap.m.MessageBox.confirm("Are you sure you want to update your password?", {
        actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
        onClose: (sAction) => {
          if (sAction !== sap.m.MessageBox.Action.OK) return;

          sap.ui.core.BusyIndicator.show();
          let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EmployeeCode;

          let updatePayload = {
            "profile": {
              "Password": this.getView().byId("passwordInput").getValue().trim()
            }
          };

          fetch(apiUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload)
          })
            .then(response => {
              if (!response.ok) throw new Error("Failed to update password");
              return response.json();
            })
            .then(data => {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show("Password updated successfully.");
              this.getOwnerComponent().getModel("maindata").setData(data.Results);
              this.getOwnerComponent().getModel("maindata").refresh(true);
              this.getView().byId("passwordInput").setValue("");
              this.getView().byId("confirmPasswordInput").setValue("");
            })
            .catch(error => {
              sap.ui.core.BusyIndicator.hide();
              sap.m.MessageToast.show("Error: " + error.message);
            });
        }
      });
    },
    onPressSettingPaasswordCancel: function (oEvent) {
      debugger
      this.getView().byId("FlexibleColumnLayoutSetting").setLayout("OneColumn");
      ["passwordInput", "confirmPasswordInput"].forEach(id => this.getView().byId(id).setValue(""));
    },


    EditProfileSettingPress: function () {
      debugger;
      aFields = ["FirstNameIDSettingUpdate", "LastNameIDSettingUpdate", "EmailIDSettingUpdate", "MobileNumberIDSettingUpdate", "LocalAddressIDSettingUpdate", "PermanentAddressIDSettingUpdate"],
        isValid = true;

      aFields.forEach(id => {
        let oInput = this.getView().byId(id), sValue = oInput.getValue().trim();
        oInput.setValueState(sValue ? "None" : (isValid = false, "Error"));
      });

      if (!isValid) return sap.m.MessageToast.show("Please fill all required fields.");

      sap.ui.core.BusyIndicator.show();

      let oPayload = {
        profile: {
          "firstName": this.getView().byId("FirstNameIDSettingUpdate").getValue().trim(),
          "lastName": this.getView().byId("LastNameIDSettingUpdate").getValue().trim(),
          "Email": this.getView().byId("EmailIDSettingUpdate").getValue().trim(),
          "MobileNumber": this.getView().byId("MobileNumberIDSettingUpdate").getValue().trim(),
          "LocalAddress": this.getView().byId("LocalAddressIDSettingUpdate").getValue().trim(),
          "PermanentAddress": this.getView().byId("PermanentAddressIDSettingUpdate").getValue().trim()
        }
      };

      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EmployeeCode;

      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(oPayload)
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to update profile.");
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Profile updated successfully.");
          this.getView().getOwnerComponent().getModel("maindata").setData(data.Results);
          this.getView().getOwnerComponent().getModel("maindata").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error: " + error.message);
        });
    },
    CancelProfileSettingPress: function (oEvent) {
      debugger
      this.getView().byId("FlexibleColumnLayoutSetting").setLayout("OneColumn");
    },


    onPressSettingApplyTheme: function () {
      if (!this.getView().byId("idThemeList").getSelectedItem()) {
        sap.m.MessageToast.show("Please select a theme.");
        return;
      }
      sap.ui.core.BusyIndicator.show();
      let oPayload = {
        profile: {
          "Theme":this.getView().byId("idThemeList").getSelectedItem().getId().split("-").pop()
        }
      };
      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EmployeeCode;

      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(oPayload)
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to update profile.");
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.ui.getCore().applyTheme(this.getView().byId("idThemeList").getSelectedItem().getId().split("-").pop());
          sap.m.MessageToast.show("Theme applied: " + this.getView().byId("idThemeList").getSelectedItem().getId().split("-").pop());
          this.getView().getOwnerComponent().getModel("maindata").setData(data.Results);
          this.getView().getOwnerComponent().getModel("maindata").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error: " + error.message);
        });
    },
    CancelProfileSettingPress: function (oEvent) {
      debugger
      this.getView().byId("FlexibleColumnLayoutSetting").setLayout("OneColumn");
    },


    onPressSettingSetTime: function (oEvent) {
      if (!this.getView().byId("SessionTimeoutList").getSelectedItem()) {
        sap.m.MessageToast.show("Please select a session timeout value.");
        return;
      }
      sap.ui.core.BusyIndicator.show();
      let oPayload = {
        profile: {
          "sessiontime":this.getView().byId("SessionTimeoutList").getSelectedItem().getId().split("-").pop()
        }
      };
      let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EmployeeCode;

      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(oPayload)
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to update session timeout.");
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          sap.ui.getCore().applyTheme(this.getView().byId("idThemeList").getSelectedItem().getId().split("-").pop());
          sap.m.MessageToast.show("Session timeout set to : " + this.getView().byId("SessionTimeoutList").getSelectedItem().getTitle());
          this.getView().getOwnerComponent().getModel("maindata").setData(data.Results);
          this.getView().getOwnerComponent().getModel("maindata").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error: " + error.message);
        });
    },
    CancelSessionTimeSettingPress: function (oEvent) {
      debugger
      this.getView().byId("FlexibleColumnLayoutSetting").setLayout("OneColumn");
    },

  });
});