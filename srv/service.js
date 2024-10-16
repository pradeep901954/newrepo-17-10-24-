const { update } = require('@sap/cds');
const cds = require('@sap/cds');
const { select } = require('@sap/cds/libx/_runtime/hana/execute');
const axios = require('axios');
const { nextTick } = require('process');

module.exports = async function (params, srv) {
    var UUid;
    var band;
    let { PurchaseEnquiry, QuotationVehicle, Comment, Stocks, Quotation, PurchareVehicle, PurchaseOrder, PurchaseOrderVehicle } = this.entities;

    this.before('READ', [PurchareVehicle], async (req) => {
        
        const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: UUid });
        if (LoadingStatus[0].status === 'Negotiation') {
            const vehicles = await SELECT.from(PurchareVehicle).where({ purchaseEnquiryUuid: UUid });
            // if(!vehicles[0].actualPrice){
            for (const vehicle of vehicles) {
                const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    if (quantity > 10) {
                        vehicle.discount = stockData.gold;
                        band = `Gold(${vehicle.discount})`;
                    } else if (quantity > 5) {
                        vehicle.discount = stockData.silver;
                        band = `Silver(${vehicle.discount})`;
                    } else if (quantity > 3) {
                        vehicle.discount = stockData.platinum;
                        band = `Branze(${vehicle.discount})`;
                    } else {
                        vehicle.discount = '0';
                        band = 'Non';
                    }
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();

                    if (vehicle.discount === '0') {
                        vehicle.discountedPrice = actualPrice.toString();
                    } else {
                        vehicle.discountedPrice = actualPrice - (actualPrice * vehicle.discount / 100);
                        vehicle.discountedPrice.toString();
                    }

                    await cds.update(PurchareVehicle).set({
                        actualPrice: vehicle.actualPrice,
                        band: band,
                        price: stockData.pricePerUnit.toString(),
                        discount: vehicle.discount,
                        discountedPrice: vehicle.discountedPrice.toString(),
                        tax: stockData.tax.toString()
                    }).where({ vehicleID: vehicle.vehicleID });

                } else {
                    req.error(404, `Vehicle with code ${vehicle.vehicleCode} not found in stock.`);
                }
            }
            // }
        } else if (LoadingStatus[0].status === 'Request') {
            const vehicles = await SELECT.from(PurchareVehicle).where({ purchaseEnquiryUuid: UUid });
            // if(!vehicles[0].actualPrice){
            for (const vehicle of vehicles) {
                const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });
                if (stockData) {
                    // Calculate the actual price based on quantity and stock price
                    const quantity = parseInt(vehicle.quantity);
                    const actualPrice = parseFloat(stockData.pricePerUnit) * quantity;
                    vehicle.actualPrice = actualPrice.toString();
                    vehicle.discountedPrice = actualPrice.toString();


                    await cds.update(PurchareVehicle).set({
                        actualPrice: vehicle.actualPrice,
                        price: stockData.pricePerUnit.toString(),
                        discountedPrice: vehicle.actualPrice,
                        tax: stockData.tax.toString()
                    }).where({ vehicleID: vehicle.vehicleID });

                }
            }
        }
    });

    this.before('UPDATE', PurchareVehicle.draft, async (req) => {
    
        const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: UUid });
        if (LoadingStatus[0].status === 'Negotiation') {
            const { vehicleID, discount } = req.data;
            if (discount) {
                if (discount < 0 || discount > 100 || /[a-zA-Z]/.test(discount)) {
                    return req.reject(400, 'Discount cannot be negative or Discount must be below 100 or No alphabetic characters are allowed in the discount ');
                }

                let Vehicle = await SELECT.one.from(PurchareVehicle.drafts).where({ vehicleID: vehicleID });
                if (!Vehicle) {
                    return req.reject(404, 'PurchareVehicle Vehicle record not found');
                }
                const pricePerUnit = parseFloat(Vehicle.price);
                const quantity = parseInt(Vehicle.quantity);
                const discountValue = parseFloat(discount) || 0;
                let discountedPrice = pricePerUnit;
                discountedPrice = pricePerUnit - (pricePerUnit * discountValue / 100);

                discountedPrice *= quantity;

                await cds.update(PurchareVehicle.drafts).set({
                    discountedPrice: discountedPrice.toString(),
                    discount: discountValue.toString()
                }).where({ vehicleID: vehicleID });

                // await Calculate(Vehicle.purchaseEnquiryUuid);
            }
        }
    });

    async function Calculate(purchaseEnquiryUuid) {
        const vehicles = await select.from(PurchareVehicle.drafts).where({ purchaseEnquiryUuid });

        let totalPrice = 0;
        let totalTax = 0;

        for (const vehicle of vehicles) {
            const discountedPrice = parseFloat(vehicle.discountedPrice) || 0;
            totalPrice += discountedPrice;

            const price = parseFloat(vehicle.price);
            if (isNaN(price)) {
                console.error('Invalid price for vehicle:', vehicle);
                continue; // Skip this iteration if price is not valid
            }

            const tax = parseFloat(vehicle.tax) || 0;
            const quantity = parseInt(vehicle.quantity) || 0;

            const taxAmount = (price * tax / 100) * quantity;
            totalTax += taxAmount;
        }

        const grandTotal = totalPrice + totalTax;
        await cds.update(PurchaseEnquiry)
            .set({
                totalPrice: totalPrice.toString(),
                grandTotal: grandTotal.toString(),
                tax: totalTax.toString()
            })
            .where({ purchaseEnquiryUuid });
    }

    this.on('postattach', async (req) => {
      
        var editbut = 'false';
        if (req.data.p) {
            UUid = req.data.p;
            var status = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.p });
            console.log("functionImport triggered");
            if (status[0].status == 'Request' || status[0].status == 'Negotiation') {
                editbut = "true";
            }
            return editbut, status;
        }
    });

    this.on('QuotationFunc', async (req) => {
       
        const LoadingStatus = await SELECT.from(PurchaseEnquiry).where({ purchaseEnquiryUuid: req.data.para });
        const VehicleData = await SELECT.from(PurchareVehicle).where({ purchaseEnquiryUuid: req.data.para });
        if (LoadingStatus[0].status == 'Request') {
          
            var workflowContent = {
                "context": {
                    "DocType": "AG",
                    "SalesOrg": "1000",
                    "DistChan": "10",
                    "Division": "00",
                    "qt_itemSet": [
                        {
                            "ItemNumber": "000010",
                            "Material": "100-100",
                            "Quantity": "100"
                        }
                    ],
                    "qt_partnerSet": [
                        {
                            "PartRole": "AG",
                            "PartNumber": "0000001000"
                        }
                    ]
                }
            };
            // var TEST_DEST2 = await cds.connect.to("TEST_DEST1");
            // var result1 = await TEST_DEST2.get(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet('0020000172')?$expand=qt_itemSet,qt_partnerSet&$format=json`);
            // var result1 = await TEST_DEST2.post(`/sap/opu/odata/sap/ZOD_PO_GENERATE_SRV/qt_headerSet`, workflowContent);
            // console.log(result1);

            if (LoadingStatus.length > 0) {
                const purchaseEnquiryRecord = LoadingStatus[0];  

                const purchaseEnquiryPayload = {
                    purchaseEnquiryID: purchaseEnquiryRecord.purchaseEnquiryID,
                    contactPerson: purchaseEnquiryRecord.contactPerson,
                    address: purchaseEnquiryRecord.address,
                    phone: purchaseEnquiryRecord.phone,
                    email: purchaseEnquiryRecord.email,
                    documentType: purchaseEnquiryRecord.documentType,
                    deliveryLocation: purchaseEnquiryRecord.deliveryLocation,
                    companyName: purchaseEnquiryRecord.companyName,
                    van: purchaseEnquiryRecord.van,
                    division: purchaseEnquiryRecord.division,
                    distributionchanells: purchaseEnquiryRecord.distributionchanells,
                    totalPrice: purchaseEnquiryRecord.totalPrice,
                    tax: purchaseEnquiryRecord.tax,
                    grandTotal: purchaseEnquiryRecord.grandTotal,
                    quotationID: purchaseEnquiryRecord.quotationID,
                    comments: purchaseEnquiryRecord.comments,
                    enquiryToPVehicle: VehicleData.map(vehicle => ({
                        vehicleCode: vehicle.vehicleCode,
                        vehicleName: vehicle.vehicleName,
                        vehicleColor: vehicle.vehicleColor,
                        quantity: vehicle.quantity,
                        discountedPrice: vehicle.discountedPrice,
                        price: vehicle.price,
                        tax: vehicle.tax,
                        actualPrice: vehicle.actualPrice,
                        discount: vehicle.discount,
                        band: vehicle.band
                    }))
                };
                // var SPA_API = await cds.connect.to("BpaDest");
                // var result = await SPA_API.post('/workflow/rest/v1/workflow-instances', purchaseEnquiryPayload);
                // console.log(result);
                await cds.update(PurchaseEnquiry).set({ status: 'In Process' }).where({ purchaseEnquiryUuid: UUid });

            }
        }

    });


    this.before('UPDATE', PurchaseEnquiry, async (req) => {
      

        if (req.data.status == 'Request' || req.data.status == 'Negotiation') {
           
            const vehicles1 = req.data.enquiryToPVehicle;
            if (vehicles1) {
                for (let vehicle of vehicles1) {
                    const { vehicleID, discount, discountedPrice, quantity } = vehicle;
                    const stockData = await SELECT.one.from(Stocks).where({ vehicleCode: vehicle.vehicleCode });

                    await cds.update(PurchareVehicle)
                        .set({
                            discount: req.data.discount,
                            discountedPrice: discountedPrice,
                            tax: stockData.tax.toString()
                        })
                        .where({ vehicleID: vehicleID });
                }
            }
            //totalprice and grand total and taxamount
            let totalPrice = 0;
            let totalTax = 0;
            vehicles1.forEach(vehicle => {
                if (vehicle.discount === '0' || vehicle.discount === '-' || vehicle.discount === null) {
                    totalPrice += parseFloat(vehicle.actualPrice) || 0;
                    const taxAmount = (parseFloat(vehicle.price) * (parseFloat(vehicle.tax) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
                    totalTax += taxAmount;
                } else {
                    totalPrice += parseFloat(vehicle.discountedPrice) || 0;
                    const taxAmount = (parseFloat(vehicle.price) * (parseFloat(vehicle.tax) || 0) / 100) * (parseInt(vehicle.quantity) || 0);
                    totalTax += taxAmount;
                }
            });
            var grandTotal1 = totalPrice + totalTax;

            req.data.totalPrice = totalPrice.toString();
            req.data.tax = totalTax.toString();
            req.data.grandTotal = grandTotal1.toString();

            // chechkig color and Quality
            const vehicles = req.data.enquiryToPVehicle;
            if (!vehicles || vehicles.length === 0) {
                return req.reject(400, 'No vehicles found in the Purchase Enquiry.');
            }

            let insufficientStockMessages = [];
            for (let vehicle of vehicles) {
                const { vehicleID, quantity, vehicleColor } = vehicle;

                let purchaseVehicle = await SELECT.one.from(PurchareVehicle).where({ vehicleID: vehicleID });
                if (!purchaseVehicle) {
                    insufficientStockMessages.push(`Quotation Vehicle record not found for Vehicle ID: ${vehicleID}`);
                    continue;
                }

                let stockData = await SELECT.one.from(Stocks).where({ vehicleCode: purchaseVehicle.vehicleCode });

                if (!stockData) {
                    insufficientStockMessages.push(`Stock information not found for vehicle ${purchaseVehicle.vehicleName}`);
                    continue;
                }

                const stockQuantity = parseInt(stockData.quantity);
                const requestedQuantity = parseInt(quantity || purchaseVehicle.quantity); // Use provided quantity or existing one
                if (stockData.vehicleColor !== vehicleColor) {
                    insufficientStockMessages.push(`Color ${vehicleColor} is not available for vehicle ${purchaseVehicle.vehicleName}.`);
                }
                if (requestedQuantity > stockQuantity) {
                    insufficientStockMessages.push(`Insufficient stock for vehicle ${purchaseVehicle.vehicleName}. Available quantity: ${stockQuantity}, Requested quantity: ${requestedQuantity}`);
                }
            }
            if (insufficientStockMessages.length > 0) {
                // Use req.info to show the warning messages
                // req.info(insufficientStockMessages.join('<br>'));
                const warningMessage = `⚠️ Warning: The following issues were found:<br>${insufficientStockMessages.join('<br>')}`;
                return req.reject(400, warningMessage);
            }
        }
        if (req.data.comments !== null && req.data.comments !== '') {
            debugger
            const currentDateTime = new Date().toISOString().replace('T', ' ').split('.')[0];



            debugger
            const results = await SELECT.from(PurchaseEnquiry).columns('comments').where({ purchaseEnquiryUuid: req.data.purchaseEnquiryUuid });
            debugger

            if (results[0].comments != req.data.comments) {
                await INSERT.into(Comment).entries({
                    purchaseEnquiryUuid: req.data.purchaseEnquiryUuid,
                    createdBy: req.headers["x-username"],
                    createdAt: currentDateTime,
                    commentsText: req.data.comments
                });
            }
        }
    });
}