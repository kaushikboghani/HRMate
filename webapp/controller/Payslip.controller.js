sap.ui.define([
  "./BaseController",
  "sap/m/MessageBox"
], (BaseController, MessageBox) => {
  "use strict";

  return BaseController.extend("hrmate.controller.Payslip", {
    onInit(oEvent) {
      let Router = this.getOwnerComponent().getRouter()
      Router.getRoute("RouteView4").attachPatternMatched(this._Objectfunctionset, this);
    },
    _Objectfunctionset: function (oEvent) {
      debugger
      this._onStopBusyCard(false);
      if (oEvent.getParameter("name") !== "RouteView4") {
        return;
      }
      sap.ui.core.BusyIndicator.show();
      var apiUrl = "https://hrmapi-lac.vercel.app/api/employee/Deduction?employeeCode=" + $.sap.EmployeeCode;
      fetch(apiUrl, {
        method: "GET"
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch payslip Data");
          }
          return response.json();
        })
        .then(data => {
          sap.ui.core.BusyIndicator.hide();
          let allPayslips = data.payslip
          var date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let startYear = month >= 4 ? year : year - 1;
          let endYear = (startYear + 1).toString().slice(-2);
          let financialYear = `${startYear}-${endYear}`;

          let filteredPayslips = [];
          for (let i = 0; i < allPayslips.length; i++) {
            if (allPayslips[i].Year === financialYear) {
              filteredPayslips.push(allPayslips[i]);
            }
          }
          this.getOwnerComponent().getModel("paySlipdata").setData(filteredPayslips);
          this.getOwnerComponent().getModel("paySlipdata").refresh(true);
          let totalDeductions = {};
          let totalEarnings = 0;
          let totalBonuses = 0;
          let totalNetPay = 0;

          filteredPayslips.forEach(element => {
            if (element.Year === financialYear) {
              element.Deductions.forEach(deduction => {
                if (!totalDeductions[deduction.Type]) {
                  totalDeductions[deduction.Type] = 0;
                }
                totalDeductions[deduction.Type] += Number(deduction.Amount);
              });
              totalEarnings += Number(element.GrossEarning);
              totalBonuses += Number(element.Bonuses);
              totalNetPay += Number(element.NetSalary);
            }
          });
          let totalDeductionsArray = Object.keys(totalDeductions).map(type => ({
            Type: type,
            Amount: totalDeductions[type]
          }));

          this.getOwnerComponent().getModel("TotalDeductions").setData(totalDeductionsArray);
          this.getOwnerComponent().getModel("TotalDeductions").refresh(true);
          var sumtotalDeductionsArray = 0
          for (var z = 0; z < totalDeductionsArray.length; z++) {
            sumtotalDeductionsArray += totalDeductionsArray[z].Amount
          }
          let totalData = {
            "TotalDeductions": sumtotalDeductionsArray,
            "TotalEarnings": totalEarnings,
            "TotalBonuses": totalBonuses,
            "TotalNetPay": totalNetPay
        };
        this.getOwnerComponent().getModel("YearlyDeductions").setData(totalData);
        this.getOwnerComponent().getModel("YearlyDeductions").refresh(true);
        })
        .catch(error => {
          sap.ui.core.BusyIndicator.hide();
          sap.m.MessageToast.show("Error occurred: " + error.message);

        });



    },


    onDownloadPayslip: function (oEvent) {
      debugger

    }
  });
});