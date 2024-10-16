
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
                oDialog = sap.ui.xmlfragment(this.getView().getId(), "msales.ext.fragment.Comments", this);
                this.getView().addDependent(oDialog);
            }

            // Define the URL for the OData service
            var sUrl = "https://6ad3155ftrial-dev-mahindra-sales-srv.cfapps.us10-001.hana.ondemand.com/odata/v4/my/Comment";
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

                
                const currentUrl = window.location.href;
                const regex = /purchaseEnquiryUuid=([a-f0-9\-]+)/;
                const match = currentUrl.match(regex);
                var pid;
                if (match && match[1]) {
                    pid = match[1];
                    console.log(pid);;
                } else {
                    console.log("UUID not found");
                }
                const filteredData = aData.filter(item => item.purchaseEnquiryUuid === pid );
                debugger
                if (filteredData && filteredData === null) {
                    reject("Sorry No Comment History Found");
                }else{ 
                var oCommentModel = new JSONModel();
                oCommentModel.setData({ Files: filteredData });

                oDialog.setModel(oCommentModel, "myModel");

                
                oDialog.open();
                }
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

