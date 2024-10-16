sap.ui.define(['sap/ui/core/mvc/ControllerExtension'], function (ControllerExtension) {
	'use strict';
var send ;
var Quotation;
var Quotation1;
var comments;
	return ControllerExtension.extend('msales.ext.controller.Obj_page_s', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
             * Called when a controller is instantiated and its View controls (if available) are already created.
             * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
             * @memberOf msales.ext.controller.Obj_page_s
             */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				var oModel = this.base.getExtensionAPI().getModel();
			},
			editFlow: {
				onAfterEdit: function (mParameters) {
					debugger
					setTimeout(() => {
						send.setVisible(false);
						comments.setEnabled(true);
					}, 800);
					
				},
				onAfterSave: function (mParameters) {
					debugger
					setTimeout(() => {
						send.setVisible(true);
						comments.setEnabled(false);
						this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Edit';
				
					}, 800);
				}
			},
			onBeforeRendering: async function (oParameter) {
				debugger
				this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].mProperties.text = 'Raise Quotation';
			},
			routing: {
				onAfterBinding: async function (oParameter) {
					debugger
					// 
					send = this.base.getView().mAggregations.content[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[3];
					send.setVisible(false);
					Quotation = this.base.getView().mAggregations.content[0].mAggregations.sections[3];
					Quotation1 = this.base.getView().mAggregations.content[0].mAggregations.sections[2];
					comments = this.base.getView().mAggregations.content[0].mAggregations.sections[5].mAggregations._grid.mAggregations.content[0].mAggregations._grid.mAggregations.content[0].mAggregations.content.mAggregations.items[1]
					comments.setEnabled(false);


					let funcname = 'postattach';
					let oFunction = oParameter.getModel().bindContext(`/${funcname}(...)`);
					var a;
					var uuid = window.location.href;
					const regex1 = /purchaseEnquiryUuid=([a-fA-F0-9-]+)/;;
					const match1 = uuid.match(regex1);
					if (match1) {
						a = match1[1];
						console.log(a); // Output: 1
					}
					oFunction.setParameter('p', a);
					await oFunction.execute();
					const oContext = oFunction.getBoundContext();
					var result = oContext.getValue();
					debugger
					if(result.value.status === 'Request'){
						this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(true);
						Quotation.setVisible(false);
						Quotation1.setVisible(true);

					}else if(result.value.status === 'Negotiation'){
						this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(true);
						Quotation.setVisible(true);
						Quotation1.setVisible(false);


					}else if (result.value.status === 'Approved'){
						this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(false);
						Quotation.setVisible(true);
						Quotation1.setVisible(false);

					}else if (result.value.status === 'In Process'){
						this.base.getView().getContent()[0].mAggregations.headerTitle.mAggregations._actionsToolbar.mAggregations.content[2].setEnabled(false);
						Quotation.setVisible(false);
						Quotation1.setVisible(true);
		
					}
				},
				onBeforeBinding: async function (oParameter) {
					debugger
				}
			}
		}
	});
});
