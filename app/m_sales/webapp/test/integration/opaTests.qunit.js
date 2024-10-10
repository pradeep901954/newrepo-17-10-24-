sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'msales/test/integration/FirstJourney',
		'msales/test/integration/pages/PurchaseEnquiryList',
		'msales/test/integration/pages/PurchaseEnquiryObjectPage'
    ],
    function(JourneyRunner, opaJourney, PurchaseEnquiryList, PurchaseEnquiryObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('msales') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onThePurchaseEnquiryList: PurchaseEnquiryList,
					onThePurchaseEnquiryObjectPage: PurchaseEnquiryObjectPage
                }
            },
            opaJourney.run
        );
    }
);