sap.ui.define(["./BaseController", "sap/m/MessageBox", "sap/ui/core/Fragment"], (BaseController, MessageBox, Fragment) => {
    "use strict";

    return BaseController.extend("hrmate.controller.login", {
        onInit() {
            this.getView().byId("sUserID").attachBrowserEvent("keydown", this._handleEnterKey.bind(this));
            this.getView().byId("SuserPassword").attachBrowserEvent("keydown", this._handleEnterKey.bind(this));
        },
        onAfterRendering:function(){
            var sAppModulePath = "hrmate";
			this.getView().byId("ImageIdLogin").setSrc(jQuery.sap.getModulePath(sAppModulePath) + "/image/Daffodils.png");   
 
        },
        onLogin: function (oEvent) {
            debugger
            this.sUserID = this.getView().byId("sUserID").getValue();
            this.sPassword = this.getView().byId("SuserPassword").getValue();
            var currentDate = new Date();
            var formattedDate = currentDate.getDate().toString().padStart(2, '0') + "-" +
                (currentDate.getMonth() + 1).toString().padStart(2, '0') + "-" +
                currentDate.getFullYear();

            if (!this.sUserID || !this.sPassword) {
                sap.m.MessageToast.show("Employee Code and Password are required.");
                return;
            }
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var isValidUser = false;
                    data.forEach(element => {
                        if (element.EmployeeCode === Number(this.sUserID) && element.profile.Password === this.sPassword) {
                            element.currentDate = formattedDate;
                            this.getOwnerComponent().getModel("maindata").setData(element);
                            $.sap.EmployeeCode = element.EmployeeCode
                            if (element.profile.role === "Admin") {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteView10");
                            } else {
                                var oRouter = this.getOwnerComponent().getRouter();
                                oRouter.navTo("RouteView1");
                            }
                            isValidUser = true;
                        }
                    });
                    if (!isValidUser) {
                        MessageBox.error("Invalid Employee Code or Password. Please try again.");
                        sap.ui.core.BusyIndicator.hide();
                    }
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.error("Error occurred: " + error.message);
                });
        },

        _handleEnterKey: function (oEvent) {
            if (oEvent.key === "Enter" || oEvent.keyCode === 13) {
                this.onLogin();
            }
        },

        onForgetPassword: function (oEvent) {
            debugger
            var sEmployeeCode = this.getView().byId("sUserID").getValue();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee";

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch punch history");
                    }
                    return response.json();
                })
                .then(data => {
                    var employeeFound = false;
                    sap.ui.core.BusyIndicator.hide();
                    data.forEach(element => {
                        if (element.EmployeeCode === Number(sEmployeeCode)) {
                            employeeFound = true;

                            MessageBox.information(
                                "verification code sent to your registered email: " + element.profile.Email + "?", {
                                title: "Forgot Password",
                                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                                onClose: function (oAction) {
                                    if (oAction === MessageBox.Action.OK) {
                                        sap.m.MessageToast.show("Verification code has been sent to your registered email.");
                                    } else {
                                        sap.m.MessageToast.show("You clicked Cancel. No action taken.");
                                    }
                                }
                            }
                            );


                        }
                    });
                    if (!employeeFound) {
                        MessageBox.error("Please enter the correct Employee Code");
                    }
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });

        }






    });
});
