// sap.ui.define([
//     "sap/m/MessageToast"
// ], function(MessageToast) {
//     'use strict';

//     return {
//         onPress: function(oEvent) {
//             MessageToast.show("Custom handler invoked.");
//         }
//     };
// });

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return {

        onBrowseHistoryPress: async function() {
            // Get the dialog
            var oDialog = this.byId("commentHistoryDialog");

            // Ensure the dialog is created
            if (!oDialog) {
                oDialog = sap.ui.xmlfragment(this.getView().getId(), "salesapp.ext.fragment.Comments_History", this);
                this.getView().addDependent(oDialog);
            }

            // Define the URL for the OData service
            var sUrl = "https://0e52a822trial-harsha-cloud-foundty-mahindra-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/Comment";
             debugger
            try {
                // Fetch data using jQuery.ajax
                const aData = await new Promise((resolve, reject) => {
                    jQuery.ajax({
                        url: sUrl,
                        method: "GET",
                        dataType: "json",
                        success: function(oData) {
                            // Check if oData has a value property
                            if (oData && oData.value) {
                                resolve(oData.value);
                            } else {
                                reject("No data found");
                            }
                        },
                        error: function(oError) {
                            reject(oError.responseText || "Error fetching data");
                        }
                    });
                });

                debugger
                // Create a JSON model for the retrieved data
                var oCommentModel = new JSONModel();
                oCommentModel.setData({ Files: aData });

                // Set the model to the dialog
                oDialog.setModel(oCommentModel, "myModel");

                // Open the dialog
                oDialog.open();
            } catch (error) {
                // Handle error
                console.error("Error fetching comment data:", error);
                MessageToast.show("Failed to load comment history: " + error);
            }
        },

        onCloseHistoryDialog: function() {
            // Get the dialog
            var oDialog = this.byId("commentHistoryDialog");
            
            // Close the dialog
            if (oDialog) {
                oDialog.close();
            }
        },

        onDialogOpen: function() {
            // Optionally handle logic when the dialog opens
            console.log("Comment History Dialog opened");
        }

    }
});

