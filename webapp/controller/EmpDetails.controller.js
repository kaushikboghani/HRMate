sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"

], (BaseController, MessageBox, Fragment) => {
    "use strict";

    return BaseController.extend("hrmate.controller.EmpDetails", {
        onInit: function () {
            sap.ui.core.BusyIndicator.hide();
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView9").attachPatternMatched(this._Objectfunctionget, this);
            var sModel = new sap.ui.model.json.JSONModel({ "name": "", "amount": "", "description": "" })
            this.getView().setModel(sModel, "DeductionaddModel");
        },
        _Objectfunctionget: function (oEvent) {
            debugger
            if (oEvent.getParameter("name") !== "RouteView9") {
                return;
            }
            sap.ui.core.BusyIndicator.hide();
            var previousdata = oEvent.getParameter("arguments").index;
            var newdatawindow = window.decodeURIComponent(previousdata)
            var newdata = JSON.parse(newdatawindow);
            var dataEmployee = this.getOwnerComponent().getModel("EMPData").getData()[newdata]
            this.getOwnerComponent().getModel("EmployeeDetails").setData(dataEmployee);
            this.getOwnerComponent().getModel("EmployeeDetails").setProperty("/isEnable", false);
            this.getOwnerComponent().getModel("EmployeeDetails").refresh(true);
            $.sap.EMPCode = dataEmployee.EmployeeCode
            this._onGetEmployeePunchHitoryData();
            this._onFetchDeductionData();
            this._getLeaveBalanceData();
        },
        onRouteAdminPage: function (oEvent) {
            debugger
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteView10")
        },
        onEmaEditProfilePress: function (oEvent) {
            debugger
            this.getOwnerComponent().getModel("EmployeeDetails").setProperty("/isEnable", true);
        },
        onCancelEditProfilePress: function (oEvent) {
            debugger
            this.getOwnerComponent().getModel("EmployeeDetails").setProperty("/isEnable", false);
        },
        onSaveEditProfilePress: function (oEvent) {
            debugger
            sap.ui.core.BusyIndicator.show();
            let apiUrl = "https://hrmapi-lac.vercel.app/api/employee?employeeCode=" + $.sap.EMPCode;

            var data = this.getOwnerComponent().getModel("EmployeeDetails").getData().profile
            let updatePayload = {
                "profile": data
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
                        throw new Error("Failed to update Profile Data");
                    }
                    return response.json();
                })
                .then(data => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Profile Updated Successfully");
                    this.getOwnerComponent().getModel("EmployeeDetails").setProperty("/isEnable", false);

                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        pressavtar: function () {
            debugger
            if (this.getOwnerComponent().getModel("EmployeeDetails").getData().isEnable === true) {
                this._pPopover = this.loadFragment({
                    name: "hrmate.fragments.profileimage",
                }).then(function (oPopover) {
                    oPopover.open();
                });
            } else {

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

                };
                reader.readAsDataURL(oFile);

            }

        },
        ////////////////////////////////////PunchHistory/////////////////////////////////////////////////////////////////////////
        _onGetEmployeePunchHitoryData: function () {
            debugger
            sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EMPCode;

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
                .then(data => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("EMPPunchHistory").setData(data.punchHistory);
                    this.getOwnerComponent().getModel("EMPPunchHistory").refresh(true);
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onAddPunchHistory: function (oEvent) {
            var that = this;
            var isValid = true;
            var punchApiUrl = "https://hrmapi-lac.vercel.app/api/employee/PunchHistory?employeeCode=" + $.sap.EMPCode;

            sap.ui.core.BusyIndicator.show();

            ["dateInput", "punchInInput", "punchOutInput", "punchInAddressInput", "punchOutAddressInput"].forEach(id => {
                var inputField = this.getView().byId(id);
                var value = inputField.getValue().trim();

                if (!value) {
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

            var PayloadData = {
                date: this.getView().byId("dateInput").getValue(),
                punchIn: this.getView().byId("punchInInput").getValue(),
                punchOut: this.getView().byId("punchOutInput").getValue(),
                Inaddress: this.getView().byId("punchInAddressInput").getValue(),
                Outaddress: this.getView().byId("punchOutAddressInput").getValue()
            };

            fetch(punchApiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(PayloadData)
            })
                .then(response => response.json())
                .then(data => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Punch History Data Add Successfully");
                    oEvent.getSource().getParent().close()
                    oEvent.getSource().getParent().destroy()
                    this._onGetEmployeePunchHitoryData();
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onDownloadEMPPunchData: function () {
            var doc = new window.jspdf.jsPDF();

            if (!doc.autoTable) {
                MessageBox.error("autoTable plugin is not loaded. Check script sources.");
                return;
            }

            let oModel = this.getOwnerComponent().getModel("EMPPunchHistory");
            let aData = oModel.getProperty("/");

            if (!aData || aData.length === 0) {
                sap.m.MessageToast.show("No data available to download.");
                return;
            }

            let employeeName = this.getOwnerComponent().getModel("EmployeeDetails").getData().profile.firstName + " " +
                this.getOwnerComponent().getModel("EmployeeDetails").getData().profile.lastName;

            let base64Image = "data:image/png;base64,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"

            let pageWidth = doc.internal.pageSize.width;

            let imgWidth = 30;
            let imgHeight = 30;
            let imgX = (pageWidth - imgWidth) / 2;
            let imgY = 10;
            doc.addImage(base64Image, "PNG", imgX, imgY, imgWidth, imgHeight);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.text("Daffodils Info Solutions Private Limited", pageWidth / 2, imgY + imgHeight + 10, { align: "center" });

            doc.setFontSize(16);
            doc.text("Employee Punch History", pageWidth / 2, imgY + imgHeight + 25, { align: "center" });

            doc.setFontSize(12);
            doc.text("Employee: " + employeeName, pageWidth / 2, imgY + imgHeight + 40, { align: "center" });

            let headers = [["Date", "Punch In", "Punch Out", "Punch In Address", "Punch Out Address"]];
            let data = aData.map(item => [
                item.date || "-",
                item.punchIn || "-",
                item.punchOut || "-",
                item.Inaddress || "-",
                item.Outaddress || "-"
            ]);

            doc.autoTable({
                head: headers,
                body: data,
                startY: imgY + imgHeight + 50,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 3 },
                headStyles: { fillColor: [0, 122, 204] }
            });

            let pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }

            doc.save(`Punch_History_${employeeName}.pdf`);
        },
        ////////////////////////////////////Deductions/////////////////////////////////////////////////////////////////////////
        _onFetchDeductionData: function () {
            debugger
            // sap.ui.core.BusyIndicator.show();
            this.employeeCodeData = this.getOwnerComponent().getModel("EmployeeDetails").getData().EmployeeCode;
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/Deduction?employeeCode=" +$.sap.EMPCode;

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch Employee DeductionData Data");
                    }
                    return response.json();
                })
                .then(DeductionData => {
                    sap.ui.core.BusyIndicator.hide();
                    this.getOwnerComponent().getModel("DeductionData").setData(DeductionData.Deduction);
                    this.getOwnerComponent().getModel("DeductionData").refresh(true);
                    this.getView().byId("DeleteEMPDeductionDetails").setVisible(false);


                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                    this.getView().byId("DeleteEMPDeductionDetails").setVisible(false);
                });

        },


        onAddDeductionDetails: function () {
            debugger
            var isValid = true;
            ["idDeductionType", "idDeductionAmount", "idDeductionDescription"].forEach(id => {
                var inputField = this.getView().byId(id);
                var value = inputField.getValue().trim();

                if (!value) {
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
            var payload = this.getView().getModel("DeductionaddModel").getData();
            payload.amount = parseFloat(payload.amount);
            payload.description = payload.description ? payload.description : "";

            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/Deduction?employeeCode=" + $.sap.EMPCode;
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
                    sap.m.MessageToast.show("Employee Deduction Data Added Successfully");
                    this.getView().getModel("DeductionaddModel").setData({ "name": "", "amount": "", "description": "" });
                    this.getView().getModel("DeductionaddModel").refresh(true);
                    this._onFetchDeductionData();


                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onDeleteEMPDeductionDetails: function (oevent) {
            debugger;
            var data = this.getView().getModel("DeductionaddModel").getData().name

            if (data === "" || undefined) {
                sap.m.MessageBox.error("Please select Deduction on Chart to delete.");
                return;
            }

            let apiUrl = "https://hrmapi-lac.vercel.app/api/employee/Deduction?employeeCode=" + $.sap.EMPCode + "&id=" + data;
            sap.m.MessageBox.confirm("Are you sure you want to delete the selected Deduction Type?", {
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
                            .then(() => {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Selected items deleted successfully.");
                                this.getView().getModel("DeductionaddModel").setData({ "name": "", "amount": "", "description": "" });
                                this.getView().getModel("DeductionaddModel").refresh(true);
                                oevent.getSource().setVisible(false);
                                this._onFetchDeductionData();
                            })
                            .catch(error => {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Error occurred: " + error.message);
                                oevent.getSource().setVisible(false);

                            });
                    }
                }
            });
        },
        onselectitemdeduction: function (oevent) {
            debugger
            this.getView().byId("DeleteEMPDeductionDetails").setVisible(true);
            this.oSelectedItems = oevent.getParameter("data")[0].data
            delete this.oSelectedItems._context_row_number;
            this.getView().getModel("DeductionaddModel").setData(this.oSelectedItems);
            this.getView().getModel("DeductionaddModel").refresh(true);
        },
        ondeselectData: function () {
            debugger
            this.getView().byId("DeleteEMPDeductionDetails").setVisible(false);
            this.getView().getModel("DeductionaddModel").setData({ "name": "", "amount": "", "description": "" })
            this.getView().getModel("DeductionaddModel").refresh(true);
        },

        ////////////////////////////////////Leave/////////////////////////////////////////////////////////////////////////
        _getLeaveBalanceData: function () {
            debugger
            // sap.ui.core.BusyIndicator.show();
            var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + $.sap.EMPCode;

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
                    this.getOwnerComponent().getModel("EMPLeaveBlanceData").setData(LeaveBlanceData);
                    this.getOwnerComponent().getModel("EMPLeaveBlanceData").refresh(true);
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },


        onAddLeaveEmployee: function () {
            [this.getView().byId("idLeaveDayAmount"), this.getView().byId("idLeaveTypeAdd")].forEach(oField => {
                var sValue = oField.isA("sap.m.Select") ? oField.getSelectedKey() : oField.getValue();
                oField.setValueState(sValue ? "None" : "Error").setValueStateText(sValue ? "" : "Required");
            });
            if (!this.getView().byId("idLeaveDayAmount").getValue() || !this.getView().byId("idLeaveTypeAdd").getSelectedKey()) return;
            var LeaveAPIUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + $.sap.EMPCode;
            sap.ui.core.BusyIndicator.show();
            var PayloadData = this.getView().getModel("addleavepayloaddata").getData();
            PayloadData.days = Number(PayloadData.days);
            fetch(LeaveAPIUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(PayloadData)
            })
                .then(response => response.json())
                .then(data => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Leave Balance Data Add Successfully");
                    this.getView().getModel("addleavepayloaddata").setData({ "days": "", "type": "" })
                    this.getView().byId("DeleteEMPLeaveDetails").setVisible(false);
                    this._getLeaveBalanceData();

                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                    this.getView().byId("DeleteEMPLeaveDetails").setVisible(false);
                });

        },



        DeleteLeaveEmployee: function () {
            debugger
            var data = this.getView().getModel("addleavepayloaddata").getData().type

            if (data === "" || undefined) {
                sap.m.MessageBox.error("Please select Leave on Chart to delete.");
                return;
            }

            let apiUrl = "https://hrmapi-lac.vercel.app/api/employee/leaveBalance?empcode=" + $.sap.EMPCode + "&type=" + data;


            sap.m.MessageBox.confirm("Are you sure you want to delete the selected Leave Type?", {
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
                            .then(() => {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Selected items deleted successfully.");
                                this.getView().getModel("addleavepayloaddata").setData({ "days": "", "type": "" })

                                this._getLeaveBalanceData();
                            })
                            .catch(error => {
                                sap.ui.core.BusyIndicator.hide();
                                sap.m.MessageToast.show("Error occurred: " + error.message);
                            });
                    }
                }
            });
        },
        onselectLeaveType: function (oevent) {
            debugger
            this.oSelectedItemsLeave = oevent.getParameter("data")[0].data
            delete this.oSelectedItemsLeave._context_row_number;
            this.getView().getModel("addleavepayloaddata").setData(this.oSelectedItemsLeave);
            this.getView().getModel("addleavepayloaddata").refresh(true);
            this.getView().byId("DeleteEMPLeaveDetails").setVisible(true);
        },
        ondeselectDataLeave: function () {
            debugger
            this.getView().byId("DeleteEMPLeaveDetails").setVisible(false);
            this.getView().getModel("addleavepayloaddata").setData({ "days": "", "type": "" })
            this.getView().getModel("addleavepayloaddata").refresh(true);
        },
        onPopoverInfoPress: function (oEvent) {

            var oView = this.getView();

            if (!this._oPopover) {
                this.loadFragment({
                    name: "hrmate.fragments.PopoverForInform",
                    controller: this
                }).then(function (oPopover) {
                    oPopover.openBy(oEvent.getSource());
                }.bind(this));
            } else {
                this._oPopover.openBy(oEvent.getSource());
            }
            const isVisible = this.getOwnerComponent().getModel("isVisible");
            isVisible.setProperty("/visible", oEvent.getSource().getFieldGroupIds()[0] === "Leaves");
            isVisible.refresh(true);

        }


    });
});