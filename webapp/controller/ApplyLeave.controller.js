sap.ui.define(["./BaseController", "sap/m/MessageBox"], (BaseController, MessageBox) => {
    "use strict";

    return BaseController.extend("hrmate.controller.ApplyLeave", {
        onInit() {
            this._onStopBusyCard(false);
            this._getLeaveBalanceDataEmployee();
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView11").attachPatternMatched(this._ObjectfunctiongetMaster, this);
        },
        onAfterRendering() {
            var oToday = new Date();
            this.getView().byId("idStartDate").setMinDate(oToday);
            this.getView().byId("idToDate").setMinDate(oToday);
        },
        _ObjectfunctiongetMaster: function () {
            this.getView().getModel("LeaveApplyFormData").setData({});
            this.getView().byId("idFileUploader").setValue();
            sap.ui.core.BusyIndicator.hide();
        },
        onSelectIconTabFilteremployeeleave: function (oevent) {
            debugger
            if (oevent.getSource().getSelectedKey() === "AppliedLeaves") {
                this.onFilterStatus();
                this._onGetEmployeeLeaveData();
            }
        },
        _getLeaveBalanceDataEmployee: function () {
            debugger
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + $.sap.EmployeeCode;

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
                .then(LeaveBlanceData => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("LeaveBalanceEmployee").setData(LeaveBlanceData);
                    this.getOwnerComponent().getModel("LeaveBalanceEmployee").refresh(true);
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onSelectLeaveType: function (oEvent) {
            var selectedKey = this.getView().byId("idLeaveType").getSelectedKey();
            if (selectedKey === "Leave Without Pay") {
                this.getView().byId("idLeaveBalance").setValue();
                return;
            }
            var selectedLeave = this.getOwnerComponent().getModel("LeaveBalanceEmployee").getData().find(item => item.type === selectedKey);
            if (selectedLeave) {
                this.getView().byId("idLeaveBalance").setValue(selectedLeave.days);
            } else {
                this.getView().byId("idLeaveBalance").setValue("0");
            }
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
                    that.getOwnerComponent().getModel("LeaveApplyFormData").getData().Attachment = $.sap.profileimage

                };
                reader.readAsDataURL(oFile);

            }

        },

        onFileSizeExceed: function () {
            debugger
            MessageBox.error("Oops! The selected file exceeds the maximum allowed size. Please upload a smaller file.");
        },
        onSubmitLeaveRequest: function () {
            var that = this;
            var oMainModel = this.getView().getModel("maindata").getData();
            var oLeaveModel = this.getView().getModel("LeaveApplyFormData").getData();
            var isValid = true;

            ["idLeaveType", "idStartDate", "idToDate", "FromDateDayType", "ToDateDayType", "idRemarks"].forEach(id => {
                var inputField = this.getView().byId(id);
                var value = (inputField.getMetadata().getName() === "sap.m.Select") ? inputField.getSelectedKey() :
                    (inputField.getMetadata().getName() === "sap.m.DatePicker") ? inputField.getValue() :
                        inputField.getValue();

                if (!value || (typeof value === "string" && value.trim() === "")) {
                    isValid = false;
                    inputField.setValueState("Error").setValueStateText("Required");
                } else {
                    inputField.setValueState("None");
                }
            });

            if (!isValid) {
                sap.ui.core.BusyIndicator.hide();
                return sap.m.MessageToast.show("Fill all required fields.");
            }
            if (this.getView().byId("idLeaveType").getSelectedKey() !== 'Leave Without Pay') {
                var leaveBalance = parseFloat(this.getView().byId("idLeaveBalance").getValue()) || 0;
                var totalLeaveDays = parseFloat(this.getView().byId("TotalLeaveDay").getValue()) || 0;
                if (totalLeaveDays > leaveBalance) {
                    sap.ui.core.BusyIndicator.hide();
                    return MessageBox.error("You cannot apply for more leave days than your available balance. Please adjust your request.");
                }
            }

            var currentDate = new Date();
            var appliedDateTime = currentDate.getFullYear() + "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                currentDate.getDate().toString().padStart(2, '0') + " " +
                currentDate.getHours().toString().padStart(2, '0') + ":" +
                currentDate.getMinutes().toString().padStart(2, '0') + ":" +
                currentDate.getSeconds().toString().padStart(2, '0');
            var strdata = ""
            oLeaveModel?.EmailNotificationTo?.forEach(ele => {
                strdata += ele + "|"
            })
            var docNo = Math.floor(100000 + Math.random() * 900000).toString();
            var payload = {
                ...oLeaveModel,
                lastName: oMainModel.profile.lastName,
                firstName: oMainModel.profile.firstName,
                employeecode: oMainModel.EmployeeCode,
                Email: oMainModel.profile.Email,
                stat: "Pending",
                docNo: docNo,
                appliedDateTime: appliedDateTime,
            };
            payload.EmailNotificationTo = strdata;

            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveHistory?empcode=" + oMainModel.EmployeeCode;
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
                .then(LeaveRequestData => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Leave Applied Successfully");
                    this.getView().getModel("LeaveApplyFormData").setData({})
                    this.getView().getModel("LeaveApplyFormData").refresh(true);
                    this._EmailNotificationTo(payload);

                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onCancelLeaveRequest:function(){
            this.getView().getModel("LeaveApplyFormData").setData({});
            this.getView().byId("idFileUploader").setValue();
            sap.m.MessageToast.show("Leave request canceled successfully");

        },
        onCalculateLeaveDays: function () {
            var oView = this.getView();
            var fromDate = oView.byId("idStartDate").getDateValue();
            var fromDayType = oView.byId("FromDateDayType").getSelectedKey();
            var toDate = oView.byId("idToDate").getDateValue();
            var toDayType = oView.byId("ToDateDayType").getSelectedKey();
            var totalDays = 0;

            if (!fromDate || !toDate) {
                oView.byId("TotalLeaveDay").setValue(0);
                return;
            }

            var oneDay = 24 * 60 * 60 * 1000;
            var diffDays = Math.round((toDate - fromDate) / oneDay);

            if (diffDays < 0) {
                MessageBox.error("Invalid Date Selection: From Date should be before To Date");
                oView.byId("idStartDate").setValue();
                oView.byId("FromDateDayType").setSelectedKey();
                oView.byId("idToDate").setValue();
                oView.byId("ToDateDayType").setSelectedKey();
                totalDays = ""
                return;
            }

            if (diffDays === 0) {
                if (
                    (fromDayType === "Firsthalf" && toDayType === "Firsthalf") ||
                    (fromDayType === "Secondhalf" && toDayType === "Secondhalf")
                ) {
                    totalDays = 0.5;
                } else {
                    totalDays = 1;
                }
            } else {
                totalDays = fromDayType === "FullDay" ? 1 : 0.5;
                totalDays += diffDays - 1;
                totalDays += toDayType === "FullDay" ? 1 : 0.5;
                if (diffDays === 1 && fromDayType === "Secondhalf" && toDayType === "Firsthalf") {
                    totalDays = 1;
                }
            }
            oView.byId("TotalLeaveDay").setValue(totalDays);
        },


        _EmailNotificationTo: function (payload) {
            debugger;
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://regularization-api-dev.vercel.app/api/Email";
        
            var fileUploader = this.byId("idFileUploader");
            var file = fileUploader.oFileUpload.files[0];
        
            if (file) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    payload.base = event.target.result;
                    payload.fileName = file.name;

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
                            sap.m.MessageToast.show("E-mail sent successfully with attachment");
                            that.getView().byId("idFileUploader").setValue();
                        })
                        .catch(error => {
                            sap.ui.core.BusyIndicator.hide();
                            sap.m.MessageToast.show("Error occurred: " + error.message);
                            that.getView().byId("idFileUploader").setValue();
                        });
                };
                reader.readAsDataURL(file);
            } else {
                // Send email without attachment
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
                        sap.m.MessageToast.show("E-mail sent successfully");
                    })
                    .catch(error => {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error occurred: " + error.message);
                    });
            }
        }
        


    })
})