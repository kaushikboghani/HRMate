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
    onAfterRendering:function(){
      var sAppModulePath = "hrmate";
          this.getView().byId("PunchInTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Enter.png");   
          this.getView().byId("PunchOutTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Exit.png");  
          if(this.getOwnerComponent().getModel("maindata").getData().profile.Gender === 'Male'){
            this.getView().byId("ProfileTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/office-man.png");   
          }else if(this.getOwnerComponent().getModel("maindata").getData().profile.Gender === 'Female'){
            this.getView().byId("ProfileTileID").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/office-woman.png");
          }else{
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
      var formattedToday = today.getFullYear() + "-" +String(today.getMonth() + 1).padStart(2, "0") + "-" +String(today.getDate()).padStart(2, "0");
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
    
   
    




  });
});