using MyService as service from '../../srv/service';
annotate service.PurchaseEnquiry with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Contact Person',
                Value : contactPerson,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Company Name',
                Value : companyName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Address',
                Value : address,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Phone',
                Value : phone,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Sales Order',
                Value : salesOrder,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Document Type',
                Value : documentType,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Delivery Location',
                Value : deliveryLocation,
            },
            {
                $Type : 'UI.DataField',
                Label : 'VAN',
                Value : van,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Division',
                Value : division,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Distribution Chanells',
                Value : distributionchanells,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Total Price',
                Value : totalPrice,
            },
            {
                $Type : 'UI.DataField',
                Label : 'tax',
                Value : tax,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Grand Total',
                Value : grandTotal,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Status',
                Value : status,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Enquiry Details',
            ID : 'EnquiryDetails',
            Target : '@UI.FieldGroup#EnquiryDetails',
        },
        {
            $Type : 'UI.CollectionFacet',
            Label : 'Qoutation Details',
            ID : 'VehicleDetails',
            Facets : [
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Vehicle Details',
                    ID : 'VehicleDetails1',
                    Target : 'enquiryToPVehicle/@UI.LineItem#VehicleDetails',
                },
                {
                    $Type : 'UI.ReferenceFacet',
                    Label : 'Price',
                    ID : 'Price',
                    Target : '@UI.FieldGroup#Price',
                },
            ],
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'purchaseEnquiryID',
            Value : purchaseEnquiryID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'contactPerson',
            Value : contactPerson,
        },
        {
            $Type : 'UI.DataField',
            Label : 'address',
            Value : address,
        },
        {
            $Type : 'UI.DataField',
            Label : 'phone',
            Value : phone,
        },
        {
            $Type : 'UI.DataField',
            Label : 'email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
    ],
    UI.SelectionPresentationVariant #tableView : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'Request',
    },
    UI.LineItem #tableView : [
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryID,
            Label : 'purchaseEnquiryID',
        },
    ],
    UI.SelectionPresentationVariant #tableView1 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Pending',
                        },
                    ],
                },
            ],
        },
        Text : 'In Progress',
    },
    UI.LineItem #tableView1 : [
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryID,
            Label : 'purchaseEnquiryID',
        },
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
    ],
    UI.SelectionPresentationVariant #tableView2 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView1',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Nego',
                        },
                    ],
                },
            ],
        },
        Text : 'Negositation',
    },
    UI.LineItem #tableView2 : [
        {
            $Type : 'UI.DataField',
            Value : companyName,
            Label : 'companyName',
        },
        {
            $Type : 'UI.DataField',
            Value : purchaseEnquiryID,
            Label : 'purchaseEnquiryID',
        },
    ],
    UI.SelectionPresentationVariant #tableView3 : {
        $Type : 'UI.SelectionPresentationVariantType',
        PresentationVariant : {
            $Type : 'UI.PresentationVariantType',
            Visualizations : [
                '@UI.LineItem#tableView2',
            ],
        },
        SelectionVariant : {
            $Type : 'UI.SelectionVariantType',
            SelectOptions : [
                {
                    $Type : 'UI.SelectOptionType',
                    PropertyName : status,
                    Ranges : [
                        {
                            Sign : #I,
                            Option : #EQ,
                            Low : 'Approved',
                        },
                    ],
                },
            ],
        },
        Text : 'Purchase Order',
    },
    UI.FieldGroup #EnquiryDetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : purchaseEnquiryID,
                Label : 'PurchaseEnquiry ID',
            },
            {
                $Type : 'UI.DataField',
                Value : deliveryLocation,
                Label : 'Delivery Location',
            },
        ],
    },
    UI.FieldGroup #Price : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : totalPrice,
                Label : 'Total Price',
            },
            {
                $Type : 'UI.DataField',
                Value : tax,
                Label : 'Tax',
            },
            {
                $Type : 'UI.DataField',
                Value : grandTotal,
                Label : 'Grand Total',
            },
        ],
    },
);

annotate service.PurchareVehicle with @(
    UI.LineItem #VehicleDetails : [
        {
            $Type : 'UI.DataField',
            Value : vehicleCode,
            Label : 'vehicleCode',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleName,
            Label : 'Vehicle Name',
        },
        {
            $Type : 'UI.DataField',
            Value : vehicleColor,
            Label : 'Vehicle Color',
        },
        {
            $Type : 'UI.DataField',
            Value : quantity,
            Label : 'Quantity',
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : 'Price Per Unit',
        },
        {
            $Type : 'UI.DataField',
            Value : actualPrice,
            Label : 'Atual Price',
        },
        {
            $Type : 'UI.DataField',
            Value : discount,
            Label : 'Discount In persent',
        },
        {
            $Type : 'UI.DataField',
            Value : discountedPrice,
            Label : 'Discounted Price',
        },
    ]
);

annotate service.PurchareVehicle with {
    vehicleCode @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    vehicleName @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    vehicleColor @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    quantity @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    price @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    actualPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchareVehicle with {
    discountedPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    totalPrice @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    tax @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    grandTotal @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    purchaseEnquiryID @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    deliveryLocation @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    contactPerson @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    address @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    phone @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    email @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    salesOrder @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    documentType @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    companyName @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    van @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    division @Common.FieldControl : #ReadOnly
};

annotate service.PurchaseEnquiry with {
    distributionchanells @Common.FieldControl : #ReadOnly
};

