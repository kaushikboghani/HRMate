sap.ui.define([
    "sap/ui/core/UIComponent",
    "hrmate/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("hrmate.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);
            var oRouter = this.getRouter();
            var isLoggedIn = sessionStorage.getItem("isLoggedIn"); 

            if (!isLoggedIn) {
              oRouter.navTo("RouteView8"); 
            }
            // history.pushState(null, "", location.href);
            // window.addEventListener("popstate", () => {
            //     history.pushState(null, "", location.href);
            // });


            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});