const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const OtherCostSchema = Schema({
	unit: {
		type: Number,
	},
	amount: {
		type: Number,
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
});

const PalletsSchema = Schema({
	unit: {
		type: Number,
	},
	length: {
		type: Number,
		required: true,
	},
	width: {
		type: Number,
		required: true,
	},
	height: {
		type: Number,
		required: true,
	},
	weight: {
		type: Number,
		required: true,
	},
});

const QuoteSchema = Schema(
	{
		id: {
			type: String,
			default: Math.floor(Math.random() * 100000),
		},
		type: {
			type: String,
			default: 'LCL'		// Vehicle
		},
		// Data for vehicle
		vehicleYear: {
			type: String
		},
		VINNumber: {
			type: String
		},
		vehicleSize: {
			type: String
		},
		knowAduanaServices: {
			type: String
		},
		startAndDrive: {
			type: String
		},
		vehicleModel: {
			type: String
		},
		image: {
			type: String
		},

		// End data for vehicle
		warehouse: {
			type: String,
			required: true,
		},
		countryOfImport: {
			type: String,
			required: true,
		},
		pallets: {
			type: [PalletsSchema],
		},
		unitType: {
			type: String,
			default: "in"
		},
		typeOfMerchandise: {
			type: String
		},
		commercialInvoice: {
			type: String
		},
		statusOfShipment: {
			type: String
		},
		collectionTransport: {
			type: String
		},
		description: {
			type: String,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		pickupTransportation: {
			type: Object,
			default: {
				unit: 0,
				amount: 0,
			},
		},
		exportAndFreight: {
			type: Object,
			default: {
				// freightRate: 0,
				// portFee: 0,
				// documentFee: 0,
				// billofLadingFee: 0,
				// destinationBillofLadingFee: 0,
				// chargeFee: 0,
				unit: 0,
				amount: 0,
			},
		},
		ecommerceLogisticServices: {
			type: Object,
			default: {
				unit: 1,
				amount: 250,
			},
		},
		customAduanaServices: {
			type: Object,
			default: {
				// classifyProduct: 0,
				// rojoSelective: 0,
				// review: 0,
				// permitsCost: 0,
				unit: 0,
				amount: 0,
			},
		},
		deliveryToClient: {
			type: Object,
			default: {
				unit: 1,
				amount: 0,
			},
		},
		otherCosts: {
			type: [OtherCostSchema],
		},
		tax: {
			type: Number,
			default: 7,
		},
		confirmation: {
			type: String,
			default: `Esta cotización se basa en la información que el cliente ha proporcionado. La mercancía se medirá y pesará en el almacén de consolidación para facturarle con precisión al cliente.<br /> <br />La inspección en origen y en destino corre a cargo del cliente. Esto no sucede mucho, pero se requiere que los clientes entiendan este proceso.`,
		},
		consolidationAddress: {
			type: String,
		},
		heatTreatPalletRequire: {
			type: String,
		},
		status: {
			type: String,
			default: 'New',
		},
	},
	{ timestamps: true }
);

const Quote = model('quote', QuoteSchema);

module.exports = Quote;
