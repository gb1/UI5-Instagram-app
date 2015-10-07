sap.ui.define(["sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"],
    function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("UI5Camera.controller.App", {

        onInit : function () {
            this._setModel();
        },

        _setModel: function(){
            var oModel = new JSONModel("http://46.101.2.116:3000/");
            this.getView().setModel(oModel);

        },

        openNewPicDialog: function(oEvent){
            if (!this._picDialog) {
                this._picDialog = sap.ui.xmlfragment(
                    "UI5Camera.view.NewPic",
                    this
                );
            }

            this.getView().addDependent(this._picDialog);
            this._picDialog.open();

            sap.ui.getCore().byId("cam").start();
        },

        addPic: function(oEvent){

            var cam = sap.ui.getCore().byId("cam");
            var pic = cam.getPicData();
            var filter = cam.getFilter();

            if(pic === undefined){
                alert("take a pic first!");
            }

            var payload = JSON.stringify({"description": "posted from app",
                "image": pic,
                "filter": filter});

            var that = this;

            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:3000/pic',
                data: payload,
                success: function(data) {
                    that._setModel();
                },
                contentType: "application/json",
                dataType: 'json'
            });

            this._picDialog.close();
        },

        cancelPicDialog: function(){
            this._picDialog.close();
        },

        applyFilters: function(oEvent){

            var items = oEvent.getSource().getItems();

            items.forEach(function(item){
                var filter = item.getContent()[0].getContent()[0].getBindingContext().getObject().filter;
                item.getContent()[0].getContent()[0].addStyleClass(filter);
            });
        }
    });
});