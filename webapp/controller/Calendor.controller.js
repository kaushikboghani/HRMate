sap.ui.define(["./BaseController", "sap/ui/unified/DateTypeRange", "sap/ui/core/Fragment", "sap/m/MessageBox"], (BaseController, DateTypeRange, Fragment, MessageBox) => {
    "use strict";

    return BaseController.extend("hrmate.controller.Calendor", {
        onInit() {
            debugger
          
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView2").attachPatternMatched(this._Objectfunctionset, this);
        },

        _Objectfunctionset: function (oEvent) {
            debugger
            this._onStopBusyCard(false);
            if (oEvent.getParameter("name") !== "RouteView2") {
                return;
            }
            var isCalendorController = true;
            sap.ui.core.BusyIndicator.show();
            var sEMPID = localStorage.getItem("punchID")
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EmployeeCode;

            fetch(apiUrl, {
                method: "GET"
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var isValidUser = false;
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("punchhistory").setData(data.punchHistory);
                    this.getOwnerComponent().getModel("masterholiday").setData(data.masterholiday);
                    // this._setPunchHistory();
                    this._onGetEmployeeLeaveData(isCalendorController);


                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                    // this._setPunchHistory();
                    
                    this._onGetEmployeeLeaveData(isCalendorController);
                });

            this.getView().byId("calendar").removeAllSelectedDates();
            this.getView().byId("dateDayInfo").setVisible(false);
           
        },
        // _setPunchHistoryoriginal: function () {
        //     var oCalendar = this.getView().byId("calendar");
        //     var masterHolidays = this.getOwnerComponent().getModel("masterholiday").getData();
        //     var punchHistory = this.getOwnerComponent().getModel("punchhistory").getData();
        //     var leaveHistory  = this.getOwnerComponent().getModel("LeaveRequestDataEmloyee").getData();
        //     var specialDates = [];
        //     var leaveDatesArray = [];

        //     leaveHistory.forEach(leave => {
        //         var leaveFromDate = new Date(leave.FromDate);
        //         var leaveToDate = new Date(leave.ToDate);
        //         leaveFromDate.setHours(0, 0, 0, 0);
        //         leaveToDate.setHours(0, 0, 0, 0);
            
        //         var formattedFromDate = `${leaveFromDate.getFullYear()}-${(leaveFromDate.getMonth() + 1).toString().padStart(2, "0")}-${leaveFromDate.getDate().toString().padStart(2, "0")}`;
        //         var formattedToDate = `${leaveToDate.getFullYear()}-${(leaveToDate.getMonth() + 1).toString().padStart(2, "0")}-${leaveToDate.getDate().toString().padStart(2, "0")}`;
            
        //         let leaveStatusType, leaveStatusDescription;
        //         if (leave.stat === "Approve") {
        //             leaveStatusType = "Type01"; // Approved Leave
        //             leaveStatusDescription = "Approved";
        //         } else if (leave.stat === "Pending") {
        //             leaveStatusType = "Type09"; // Pending Leave
        //             leaveStatusDescription = "Pending";
        //         } else if (leave.stat === "Reject") {
        //             leaveStatusType = "Type03"; // Rejected Leave
        //             leaveStatusDescription = "Rejected";
        //         } else {
        //             leaveStatusType = "Type05"; // Default Leave Type
        //             leaveStatusDescription = "Unknown Status";
        //         }
            
        //         if (formattedFromDate === formattedToDate) {
        //             let dayType;
        //             if (leave.FromDateDayType === "Full Day" || leave.ToDateDayType === "Full Day") {
        //                 dayType = "Full Day";
        //             } else if (
        //                 (leave.FromDateDayType === "Firsthalf" && leave.ToDateDayType === "Secondhalf") || 
        //                 (leave.FromDateDayType === "Secondhalf" && leave.ToDateDayType === "Firsthalf")
        //             ) {
        //                 dayType = "Full Day";
        //             } else if (leave.FromDateDayType === leave.ToDateDayType) {
        //                 dayType = leave.FromDateDayType;
        //             } else {
        //                 dayType = leave.FromDateDayType + " & " + leave.ToDateDayType;
        //             }
            
        //             leaveDatesArray.push({
        //                 date: formattedFromDate,
        //                 leaveType: leave.LeaveType,
        //                 dayType: dayType,
        //                 statusType: leaveStatusType,
        //                 statusDescription: leaveStatusDescription
        //             });
        //         } else {
        //             leaveDatesArray.push({
        //                 date: formattedFromDate,
        //                 leaveType: leave.LeaveType,
        //                 dayType: leave.FromDateDayType,
        //                 statusType: leaveStatusType,
        //                 statusDescription: leaveStatusDescription
        //             });
            
        //             var currentDate = new Date(leaveFromDate);
        //             currentDate.setDate(currentDate.getDate() + 1);
            
        //             while (currentDate < leaveToDate) {
        //                 let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
            
        //                 leaveDatesArray.push({
        //                     date: formattedDate,
        //                     leaveType: leave.LeaveType,
        //                     dayType: "Full Day",
        //                     statusType: leaveStatusType,
        //                     statusDescription: leaveStatusDescription
        //                 });
            
        //                 currentDate.setDate(currentDate.getDate() + 1);
        //             }
            
        //             leaveDatesArray.push({
        //                 date: formattedToDate,
        //                 leaveType: leave.LeaveType,
        //                 dayType: leave.ToDateDayType,
        //                 statusType: leaveStatusType,
        //                 statusDescription: leaveStatusDescription
        //             });
        //         }
        //     });
            
        //     debugger
        //     var today = new Date();
        //     today.setHours(0, 0, 0, 0);
        //     var year = today.getFullYear();
        //     var holidayDates = new Set();
            
        //     leaveDatesArray.forEach(leave => {
        //         specialDates.push(new sap.ui.unified.DateTypeRange({
        //             startDate: new Date(leave.date),
        //             type: leave.statusType, // ✅ Uses Type01 (Approved), Type09 (Pending), or Type03 (Rejected)
        //             tooltip: `${leave.leaveType} - ${leave.dayType} (${leave.statusDescription})`
        //         }));
        //     });
            
            


        //     masterHolidays.forEach(holiday => {
        //         var dateParts = holiday.date.split("-");
        //         var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        //         date.setHours(0, 0, 0, 0);
        
        //         if (!isNaN(date)) {
        //             var formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
        //             holidayDates.add(formattedDate);
        
        //             var type = holiday.type === "HoliDay" ? "Type06" : "NonWorking";
        //             var tooltip = holiday.type === "HoliDay" ? (holiday.name || "Holiday") : "Non-Working Day";
        
        //             specialDates.push(new sap.ui.unified.DateTypeRange({
        //                 startDate: date,
        //                 type: type,
        //                 tooltip: tooltip
        //             }));
        //         }
        //     });


           
        
        //     for (var month = 0; month < 12; month++) {
        //         for (var day = 1; day <= 31; day++) {
        //             var workDate = new Date(year, month, day);
        //             if (workDate.getMonth() !== month || workDate > today) break;
        //             workDate.setHours(0, 0, 0, 0);
        
        //             var formattedDate = workDate.getFullYear() + "-" + (workDate.getMonth() + 1).toString().padStart(2, "0") + "-" + workDate.getDate().toString().padStart(2, "0");
        
        //             if (holidayDates.has(formattedDate)) continue;
        
        //             var punchEntry = punchHistory.find(e => {
        //                 return e.date === formattedDate;
        //             });
                    
                    
        //             var type = "Type02"; 
        //             var tooltip = "MSP - No Punch Data";
        
        //             if (punchEntry) {
        //                 if (punchEntry.punchIn && punchEntry.punchOut) {
        //                     type = "Type08"; 
        //                     tooltip = `Full Day - Punch In: ${punchEntry.punchIn}, Punch Out: ${punchEntry.punchOut}`;
        //                 } else {
        //                     tooltip = `MSP - Punch In: ${punchEntry.punchIn || "Not Available"}, Punch Out: ${punchEntry.punchOut || "Not Available"}`;
        //                 }
        //             }
        
        //             var todayFormatted = today.getFullYear() + "-" + (today.getMonth() + 1).toString().padStart(2, "0") + "-" + today.getDate().toString().padStart(2, "0");
        
        //             if (formattedDate === todayFormatted) {
        //                 if (punchEntry && (punchEntry.punchIn && punchEntry.punchOut)) {
        //                     type = "Type08"; 
        //                     tooltip = `Full Day - Punch In: ${punchEntry.punchIn || "N/A"}, Punch Out: ${punchEntry.punchOut || "N/A"}`;
        //                 } else {
        //                     type = "Type02"; 
        //                 }
                        
        //             }
        
        //             specialDates.push(new sap.ui.unified.DateTypeRange({
        //                 startDate: workDate,
        //                 type: type,
        //                 tooltip: tooltip
        //             }));
        //         }
        //     }
        //     oCalendar.removeAllSpecialDates();
        //     specialDates.forEach(dateEntry => oCalendar.addSpecialDate(dateEntry));
        // },


        _setPunchHistory: function () {
            var oCalendar = this.getView().byId("calendar");
            var masterHolidays = this.getOwnerComponent().getModel("masterholiday").getData();
            var punchHistory = this.getOwnerComponent().getModel("punchhistory").getData();
            var leaveHistory = this.getOwnerComponent().getModel("LeaveRequestDataEmloyee").getData();
            var specialDates = [];
            var leaveDatesArray = [];
        
            leaveHistory.forEach(leave => {
                var leaveFromDate = new Date(leave.FromDate);
                var leaveToDate = new Date(leave.ToDate);
                leaveFromDate.setHours(0, 0, 0, 0);
                leaveToDate.setHours(0, 0, 0, 0);
        
                var formattedFromDate = `${leaveFromDate.getFullYear()}-${(leaveFromDate.getMonth() + 1).toString().padStart(2, "0")}-${leaveFromDate.getDate().toString().padStart(2, "0")}`;
                var formattedToDate = `${leaveToDate.getFullYear()}-${(leaveToDate.getMonth() + 1).toString().padStart(2, "0")}-${leaveToDate.getDate().toString().padStart(2, "0")}`;
        
                let leaveStatusType, leaveStatusDescription;
                if (leave.stat === "Approve") {
                    leaveStatusType = "Type01"; // Approved Leave
                    leaveStatusDescription = "Approved";
                } else if (leave.stat === "Pending") {
                    leaveStatusType = "Type09"; // Pending Leave
                    leaveStatusDescription = "Pending";
                } else if (leave.stat === "Reject") {
                    leaveStatusType = "Type03"; // Rejected Leave
                    leaveStatusDescription = "Rejected";
                } else {
                    leaveStatusType = "Type05"; // Default Leave Type
                    leaveStatusDescription = "Unknown Status";
                }
        
                if (formattedFromDate === formattedToDate) {
                    let dayType = leave.FromDateDayType === leave.ToDateDayType ? leave.FromDateDayType : leave.FromDateDayType + " & " + leave.ToDateDayType;
        
                    leaveDatesArray.push({
                        date: formattedFromDate,
                        leaveType: leave.LeaveType,
                        dayType: dayType,
                        statusType: leaveStatusType,
                        statusDescription: leaveStatusDescription
                    });
                } else {
                    leaveDatesArray.push({
                        date: formattedFromDate,
                        leaveType: leave.LeaveType,
                        dayType: leave.FromDateDayType,
                        statusType: leaveStatusType,
                        statusDescription: leaveStatusDescription
                    });
        
                    var currentDate = new Date(leaveFromDate);
                    currentDate.setDate(currentDate.getDate() + 1);
        
                    while (currentDate < leaveToDate) {
                        let formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
        
                        leaveDatesArray.push({
                            date: formattedDate,
                            leaveType: leave.LeaveType,
                            dayType: "Full Day",
                            statusType: leaveStatusType,
                            statusDescription: leaveStatusDescription
                        });
        
                        currentDate.setDate(currentDate.getDate() + 1);
                    }
        
                    leaveDatesArray.push({
                        date: formattedToDate,
                        leaveType: leave.LeaveType,
                        dayType: leave.ToDateDayType,
                        statusType: leaveStatusType,
                        statusDescription: leaveStatusDescription
                    });
                }
            });
        
            debugger
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // 🔥 **NEW CODE: Get Employee's Date of Joining (DOJ)**
            var doj = this.getOwnerComponent().getModel("maindata").getProperty("/profile/DateofJoining");
        
            // 🔥 **NEW CODE: Use DOJ as the Start Date**
            var startDate;
            if (doj) {
                startDate = new Date(doj); // Convert DOJ to a Date object
                startDate.setHours(0, 0, 0, 0);
            } else {
                startDate = new Date(today.getFullYear(), 0, 1); // Default to Jan 1 if DOJ is missing
            }
        
            var holidayDates = new Set();
        
            leaveDatesArray.forEach(leave => {
                specialDates.push(new sap.ui.unified.DateTypeRange({
                    startDate: new Date(leave.date),
                    type: leave.statusType,
                    tooltip: `${leave.leaveType} - ${leave.dayType} (${leave.statusDescription})`
                }));
            });
        
            masterHolidays.forEach(holiday => {
                var dateParts = holiday.date.split("-");
                var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
                date.setHours(0, 0, 0, 0);
        
                if (!isNaN(date)) {
                    var formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
                    holidayDates.add(formattedDate);
        
                    var type = holiday.type === "HoliDay" ? "Type06" : "NonWorking";
                    var tooltip = holiday.type === "HoliDay" ? (holiday.name || "Holiday") : "Non-Working Day";
        
                    specialDates.push(new sap.ui.unified.DateTypeRange({
                        startDate: date,
                        type: type,
                        tooltip: tooltip
                    }));
                }
            });
        
            // 🔥 **UPDATED CODE: Loop from DOJ instead of January 1st**
            for (var workDate = new Date(startDate); workDate <= today; workDate.setDate(workDate.getDate() + 1)) {
                workDate.setHours(0, 0, 0, 0);
        
                var formattedDate = workDate.getFullYear() + "-" + (workDate.getMonth() + 1).toString().padStart(2, "0") + "-" + workDate.getDate().toString().padStart(2, "0");
        
                if (holidayDates.has(formattedDate)) continue;
        
                var punchEntry = punchHistory.find(e => e.date === formattedDate);
        
                var type = "Type02"; 
                var tooltip = "MSP - No Punch Data";
        
                if (punchEntry) {
                    if (punchEntry.punchIn && punchEntry.punchOut) {
                        type = "Type08"; 
                        tooltip = `Full Day - Punch In: ${punchEntry.punchIn}, Punch Out: ${punchEntry.punchOut}`;
                    } else {
                        tooltip = `MSP - Punch In: ${punchEntry.punchIn || "Not Available"}, Punch Out: ${punchEntry.punchOut || "Not Available"}`;
                    }
                }
        
                if (formattedDate === today.toISOString().split("T")[0]) {
                    if (punchEntry && (punchEntry.punchIn && punchEntry.punchOut)) {
                        type = "Type08"; 
                        tooltip = `Full Day - Punch In: ${punchEntry.punchIn || "N/A"}, Punch Out: ${punchEntry.punchOut || "N/A"}`;
                    } else {
                        type = "Type02"; 
                    }
                }
        
                specialDates.push(new sap.ui.unified.DateTypeRange({
                    startDate: new Date(workDate),
                    type: type,
                    tooltip: tooltip
                }));
            }
        
            oCalendar.removeAllSpecialDates();
            specialDates.forEach(dateEntry => oCalendar.addSpecialDate(dateEntry));
        },
        
        onPressLocationPunch: function (oEvent) {
            debugger
            var oButton = oEvent.getSource(),
              oView = this.getView();
      
            if (!this._pPopover) {
              this._pPopover = Fragment.load({
                id: oView.getId(),
                name: "hrmate.fragments.locationPunch",
                controller: this
              }).then(function (oPopover) {
                oView.addDependent(oPopover);
                return oPopover;
              });
            }
            this._pPopover.then(function (oPopover) {
              oPopover.openBy(oButton);
            });
            var oModel = new sap.ui.model.json.JSONModel(oEvent.getSource().getBindingContext("punchhistory").getObject())
            this.getView().setModel(oModel, "punchhistorylocation")
          },
          onPopoverCloseButton: function (oEvent) {
            oEvent.getSource().getParent().getParent().close();
            oEvent.getSource().getParent().getParent().destroy();
          },
          onDateSelect: function (oEvent) {
            var oCalendar = oEvent.getSource();
            var aSelectedDates = oCalendar.getSelectedDates();
            if (aSelectedDates.length === 0) return;
        
            var oDate = aSelectedDates[0].getStartDate();
            var formattedDate = oDate.toLocaleDateString("en-CA");
        
            var punchHistory = this.getOwnerComponent().getModel("punchhistory").getData()
            var leaveHistory = this.getOwnerComponent().getModel("LeaveRequestDataEmloyee").getData() || [];
            var specialDates = oCalendar.getSpecialDates() || [];
            var todayDate = new Date().toLocaleDateString("en-CA");
        
            var dateType = "Working Day";
            var punchEntry = null;
            var highlight = "None";
            var leavesiconshow = "false"
        
            for (var i = 0; i < punchHistory.length; i++) {
                var punchFormattedDate = new Date(punchHistory[i].date).toLocaleDateString("en-CA");
        
                if (punchFormattedDate === formattedDate) {
                    punchEntry = punchHistory[i];
        
                    if (formattedDate === todayDate) {
                        dateType = punchEntry.punchIn && punchEntry.punchOut ? "Full Day" : "Today";
                        highlight = punchEntry.punchIn && punchEntry.punchOut ? "Success" : "Warning";
                    } else {
                        dateType = punchEntry.punchIn && punchEntry.punchOut ? "Full Day" : "MSP";
                        highlight = punchEntry.punchIn && punchEntry.punchOut ? "Success" : "Error";
                    }
                    break;
                }
            }
        
            if (!punchEntry) {
                for (var j = 0; j < specialDates.length; j++) {
                    var oSpecialDate = specialDates[j];
                    var specialDate = oSpecialDate.getStartDate().toLocaleDateString("en-CA");
        
                    if (specialDate === formattedDate) {
                        var types = oSpecialDate.getType();
        
                        if (types === "Type02") {
                            dateType = "MSP";
                            highlight = "Error";
                        } else if (types === "NonWorking") {
                            dateType = "Non-Working Day";
                            highlight = "None";
                        } else if (types === "Type04") {
                            dateType = "Today";
                            highlight = "Success";
                        } else if (types === "Type06") {
                            dateType = oSpecialDate.getTooltip();
                            highlight = "Information";
                        } else if(types === "Type05") {
                            dateType = "on Leave";
                            highlight = "Information";
                            leavesiconshow = "true"
                        }else if(types === "Type01") {
                            dateType = oSpecialDate.getTooltip();
                            highlight = "Warning";
                            leavesiconshow = "true"
                        }else if(types === "Type09") {
                            dateType = oSpecialDate.getTooltip();
                            highlight = "Error";
                            leavesiconshow = "true"
                        }else if(types === "Type03") {
                            dateType = oSpecialDate.getTooltip();
                            highlight = "Error";
                            leavesiconshow = "true"
                        }
                        break;
                    }
                }
            }
            var formattedDateParts = formattedDate.split("-");
            var displayDate = formattedDateParts[2] + "-" + formattedDateParts[1] + "-" + formattedDateParts[0];
            var oModel = this.getOwnerComponent().getModel("dateinfo");
            oModel.setProperty("/date", displayDate);
            oModel.setProperty("/dateType", dateType);
            oModel.setProperty("/leaves", leavesiconshow);
            oModel.setProperty("/Highlight", highlight);
            oModel.setProperty("/punchIn", punchEntry ? punchEntry.punchIn : "");
            oModel.setProperty("/punchOut", punchEntry ? punchEntry.punchOut : "");
            this.getView().getModel("dateinfo").refresh(true);
        },
        
        getDaysOfMonth: function (year, month, dayOfWeek) {
            var days = [];
            var date = new Date(year, month, 1);
            while (date.getMonth() === month) {
                if (date.getDay() === dayOfWeek) {
                    days.push(new Date(date));
                }
                date.setDate(date.getDate() + 1);
            }
            return days;
        },

      




    })
})  