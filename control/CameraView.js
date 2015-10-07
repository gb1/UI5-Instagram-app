sap.ui.define([
    "sap/ui/core/Control",
    "sap/m/Select",
    "sap/ui/model/json/JSONModel"
], function (Control, Select, JSONModel) {
    "use strict";
    return Control.extend("UI5Camera.control.CameraView", {
        metadata : {
            properties :{
                value: {type: "string", defaultValue : ""}
            },
            aggregations : {
                _select : {type : "sap.m.Select", multiple: false, visibility : "hidden"},
                _label : {type : "sap.m.Label", multiple: false, visibility : "hidden"}
            }
        },

        getFilter: function(){
          return $("#img").attr("class");
        },

        getPicData: function(){
            if(!$("#img").attr("src")){
                this._captureImage();
            }
            return $("#img").attr("src");
        },

        init: function(){

            var oModel = new JSONModel("model/filters.json");

            sap.ui.getCore().setModel(oModel);

            this.setModel(oModel);

            var template = new sap.ui.core.Item({
                key : "{class}",
                text : "{name}"
            });

            this.setAggregation("_select", new Select({
                items: {path: '/filters', template: template},
                width: "100%",
                change: function(oItem){

                    var filter = oItem.getParameter("selectedItem").getKey();

                    $("#vid").removeClass();
                    $("#img").removeClass();
                    $("#vid").addClass(filter);
                    $("#img").addClass(filter);

                }
            }));

        },

        start : function () {
            var video = document.querySelector('video');
            var canvas = document.querySelector('canvas');
            var img = document.querySelector('img');

            var ctx = canvas.getContext('2d');
            var localMediaStream = null;

            var errorCallback = function(){
                alert("No camera support :-(");
            };

            navigator.getUserMedia  = navigator.getUserMedia ||
                navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia ||
                navigator.msGetUserMedia;

            var captureImage = function() {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d')
                    .drawImage(video, 0, 0, canvas.width, canvas.height);

                img.src = canvas.toDataURL();
                document.querySelector('img').src = canvas.toDataURL();
                $("#vid").hide();

            };

            video.addEventListener('click', captureImage, false);

            navigator.getUserMedia({video: true}, function(stream) {
                video.src = window.URL.createObjectURL(stream);
                localMediaStream = stream;
            }, errorCallback);
        },

        _captureImage: function(){

            var video = document.querySelector('video');
            var canvas = document.querySelector('canvas');
            var img = document.querySelector('img');
            var ctx = canvas.getContext('2d');
            var localMediaStream = null;

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')
                .drawImage(video, 0, 0, canvas.width, canvas.height);

            img.src = canvas.toDataURL();
            document.querySelector('img').src = canvas.toDataURL();
            $("#vid").hide();
        },

        setValue: function (iValue) {
            this.invalidate();
            this.setProperty("value", iValue, true);
        },

        renderer : function (oRM, oControl) {
            oRM.write("<div height='600px'");
            oRM.writeControlData(oControl);
            oRM.writeClasses();
            oRM.write(">");
            oRM.renderControl(oControl.getAggregation("_select"));
            oRM.write("<br/>");
            oRM.write("<video class='.ig-xpro2' id='vid' width='100%' autoplay></video>");
            oRM.write("<img id='img' class='.ig-xpro2' width='100%'/>");
            oRM.write("<canvas id='canvas' style='display:none;'></canvas>");
            oRM.write("<br/>");
            oRM.write("</div>");
        }
    });
});