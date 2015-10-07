sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function(UIComponent, JSONModel) {
    "use strict";
    return UIComponent.extend("UI5Camera.Component", {

        metadata : {
            manifest: "json"
        },

        init: function() {
            UIComponent.prototype.init.apply(this, arguments);

            var oConfig = {
                metadataUrlParams: {},
                json: true,
                loadMetadataAsync : true,
                defaultBindingMode: "TwoWay",
                defaultCountMode: "Inline",
                useBatch: false
            };
        }
    });
});