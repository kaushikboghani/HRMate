sap.ui.define([ "./BaseController", "sap/m/MessageBox"], (BaseController,MessageBox) => {
    "use strict";
  
    return BaseController.extend("hrmate.controller.profile", {
        onInit:function(){
        debugger
        let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView6").attachPatternMatched(this._Objectfunctionset, this);
    },
    _Objectfunctionset:function(){
        debugger
        this._onStopBusyCard(false); 
     }

    })
})  