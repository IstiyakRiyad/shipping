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
			default: 'LCL'		// Vehicle, FCL, AFQ
		},

		// Data for AFQ
		isDangerous: {
			type: String
		},
		pickupFromOrigin: {
			type: String
		},
		deliveryAtDestination: {
			type: String
		},



		// Data for FCL & AFQ
		containerType: {
			type: String,
		},
		origin: {
			type: String
		},
		originExtra: {
			type: String
		},
		destination: {
			type: String
		},
		destinationExtra: {
			type: String
		},
		// End of FCL Data	


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
			type: String
		},
		countryOfImport: {
			type: String
		},
		pallets: {
			type: [PalletsSchema],
		},
		unitType: {
			type: String,
			default: "in"
		},
		qubic: {
			type: Number
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
				amount: 0,
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
			default: `Esta cotizaci??n se basa en la informaci??n que el cliente ha proporcionado. La mercanc??a se medir?? y pesar?? en el almac??n de consolidaci??n para facturarle con precisi??n al cliente.<br /> <br />La inspecci??n en origen y en destino corre a cargo del cliente. Esto no sucede mucho, pero se requiere que los clientes entiendan este proceso.`,
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
