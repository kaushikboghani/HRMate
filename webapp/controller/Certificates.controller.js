sap.ui.define(["./BaseController", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (BaseController, MessageBox, Fragment, Filter, FilterOperator) => {
    "use strict";

    return BaseController.extend("hrmate.controller.Certificates", {
        onInit() {
            let Router = this.getOwnerComponent().getRouter()
            Router.getRoute("RouteView12").attachPatternMatched(this._ObjectfunctiongetMaster, this);
        },
        _ObjectfunctiongetMaster: function (oEvent) {
            debugger
            this._ongetCerificatesData();
            this._onStopBusyCard(false);
        },

        onPressUploadCertificate: function (oEvent) {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var oFileUploader = this.getView().byId("fileUploaderCertificate");
            var oFileNameInput = this.getView().byId("fileUploaderCertificateName");
            var sFileName = oFileNameInput.getValue().trim();
            var oFile = oFileUploader.oFileUpload.files[0];
            var today = new Date();
            var formattedDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            if (!sFileName || !oFile) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.show("Please Enter a certificate and enter a name.");
                return;
            }
            var sFileType = oFile.type;
            var reader = new FileReader();
            reader.onload = function (event) {
                // var sFileContent = event.target.result.split(",")[1];
                var sFileContent = event.target.result
                var sEmpCode = Number($.sap.EmployeeCode);
                var payload = {
                    employeecode: sEmpCode,
                    FileName: sFileName,
                    FileType: sFileType,
                    FileData: sFileContent,
                    UrlName: oFile.name,
                    UploadDate: formattedDate
                };

                fetch("https://regularization-api-dev.vercel.app/api/cetificate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        sap.ui.core.BusyIndicator.hide();
                        if (data?.error) {
                            sap.m.MessageToast.show("Error: " + data.error);
                        } else {
                            sap.m.MessageToast.show("Certificate uploaded successfully!");
                            oEvent.getSource().getParent().close();
                            oEvent.getSource().getParent().destroy();
                            that.getView().getModel("certificates").setData(data.Results);
                            that.getView().getModel("certificates").refresh(true);
                        }
                    })
                    .catch(error => {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error occurred: " + error.message);
                    });
            };

            reader.readAsDataURL(oFile);
        },
        onPressupdateCertificate: function (oEvent) {
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var sFileName = this.getView().byId("updatefileUploaderCertificateName").getValue().trim();
            var oFile = this.getView().byId("updatefileUploaderCertificate").oFileUpload.files[0];
            var today = new Date();
            var formattedDate = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
            if (!sFileName || !oFile) {
                sap.ui.core.BusyIndicator.hide();
                MessageBox.show("Please Enter a certificate and enter a name.");
                return;
            }
            var sFileType = oFile.type;
            var reader = new FileReader();
            reader.onload = function (event) {
                var sFileContent = event.target.result
                var payload = {
                    employeecode: oEvent.getSource().getParent().getBindingContext("certificates").getObject().employeecode,
                    FileName: sFileName,
                    FileType: sFileType,
                    FileData: sFileContent,
                    UploadDate: formattedDate,
                    UrlName: oFile.name,
                    _id: oEvent.getSource().getParent().getBindingContext("certificates").getObject()._id
                }

                fetch("https://regularization-api-dev.vercel.app/api/cetificate/" + payload.employeecode, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                })
                    .then(response => response.json())
                    .then(data => {
                        sap.ui.core.BusyIndicator.hide();
                        if (data?.error) {
                            sap.m.MessageToast.show("Error: " + data.error);
                        } else {
                            sap.m.MessageToast.show("Certificate Update successfully!");
                            oEvent.getSource().getParent().close();
                            oEvent.getSource().getParent().destroy();
                            that.getView().getModel("certificates").setData(data.Results);
                            that.getView().getModel("certificates").refresh(true);
                        }
                    })
                    .catch(error => {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show("Error occurred: " + error.message);
                    });
            };

            reader.readAsDataURL(oFile);

        },

        _ongetCerificatesData: function (oEvent) {
            debugger
            var that = this;
            sap.ui.core.BusyIndicator.show();
            var sUrl = `https://regularization-api-dev.vercel.app/api/cetificate/${$.sap.EmployeeCode}`
            fetch(sUrl, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            })
                .then(response => response.json())
                .then(certificates => {
                    sap.ui.core.BusyIndicator.hide();
                    if (certificates?.error) {
                        sap.m.MessageToast.show("Error: " + certificates.error);
                    } else {
                        var oButton = oEvent ? oEvent.getSource() : null;
                        var bShowOnlyFavorites = oButton ? oButton.getPressed() : false;

                        var aFilteredData = bShowOnlyFavorites
                            ? certificates.Results.filter(cert => cert.Favourite)
                            : certificates.Results;
                        that.getView().getModel("certificates").setData(aFilteredData);
                        that.getView().getModel("certificates").setProperty("/bShowOnlyFavorites", bShowOnlyFavorites)
                        that.getView().getModel("certificates").refresh(true);
                    }
                })
                .catch(error => {
                    sap.ui.core.BusyIndicator.hide();
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },


        onDownloadCertificate: function (oEvent) {
            var oData = oEvent.getSource().getBindingContext("certificates").getObject();
            if (!oData.FileData || !oData.FileName) {
                sap.m.MessageToast.show("File data is missing.");
                return;
            }
            var byteCharacters = atob(oData.FileData.split(",")[1]);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: oData.FileType });
            var link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = oData.FileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            sap.m.MessageToast.show("Download started.");
        },
        onToggleFavCertificate: function (oEvent) {
            var that = this;
            var oData = oEvent.getSource().getBindingContext("certificates").getObject();
            var payload = {
                _id: oData._id,
                Favourite: !oData.Favourite
            };

            oEvent.getSource().setBusy(true);

            fetch(`https://regularization-api-dev.vercel.app/api/cetificate/${oData.employeecode}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
                .then(response => response.json())
                .then(data => {
                    oEvent.getSource().setBusy(false);
                    if (data?.error) {
                        sap.m.MessageToast.show("Error: " + data.error);
                    } else {
                        sap.m.MessageToast.show(!oData.Favourite ? "Added to Favorites!" : "Removed from Favorites!");
                        that.getView().getModel("certificates").setData(data.Results);
                        that.getView().getModel("certificates").refresh(true);
                    }
                })
                .catch(error => {
                    oEvent.getSource().setBusy(false);
                    sap.m.MessageToast.show("Error occurred: " + error.message);
                });
        },

        onDeleteCertificate: function (oEvent) {
            var that = this;
            var oItem = oEvent.getParameter("listItem").getBindingContext("certificates").getObject();

            sap.m.MessageBox.confirm("Are you sure you want to delete this certificate?", {
                actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.YES) {
                        sap.ui.core.BusyIndicator.show();
                        var id = oItem._id + "|" + oItem.employeecode
                        var sUrl = `https://regularization-api-dev.vercel.app/api/cetificate/${id}`;
                        fetch(sUrl, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })
                            .then(response => response.json())
                            .then(data => {
                                sap.ui.core.BusyIndicator.hide();

                                if (data?.error) {
                                    sap.m.MessageToast.show("Error: " + data.error);
                                } else {
                                    sap.m.MessageToast.show("Certificate deleted successfully!");
                                    that.getView().getModel("certificates").setData(data.Results);
                                    that.getView().getModel("certificates").refresh(true);
                                }
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
