const router = require("express").Router();
const Quote = require("../../models/quote");
const Rate = require("../../models/rate");
const VehicleRate = require('../../models/vehicleRate');
const createHttpError = require("http-errors");
const Agent = require("../../models/agent");
const calculatePallet = require("../../utils/calculatePallet");
const sendMail = require("../../utils/sendMail");
const {upload, saveImage} = require('../../utils/storeImage');


router.post("/", upload.single('image'), async (req, res, next) => {
  try {
    const {
      // warehouse,
      // countryOfImport,
      type,
      // Vehicle Values
      vehicleYear,
      VINNumber,
      vehicleSize,
      knowAduanaServices,
      startAndDrive,
      vehicleModel,

      // LCL
      pallets,
      typeOfMerchandise,
      commercialInvoice,
      statusOfShipment,
      collectionTransport,
      description,

      // Default
      rateId,
      name,
      email,
      phone,
    } = req.body;

    let rate, exportAndFreight, customAduanaServices, image;
    if(type === 'Vehicle') {
      rate = await VehicleRate.findOne({_id: rateId});

      if (!rate) throw createHttpError(404, "Rate not found");

      if(req.file) {
        image = await saveImage(req.file);
      }

      exportAndFreight = {
        id: rate._id,
        vehicleSize: rate[vehicleSize],
        documentDeliveryFee: rate.documentDeliveryFee,
        documentFee: rate.documentFee,
        billofLadingFee: rate.billofLadingFee,
        destinationBillofLadingFee: rate.destinationBillofLadingFee,
        chargeFee: rate.chargeFee,
        unit: 1,
        amount:
          ( rate[vehicleSize] +
            rate.documentDeliveryFee +
            rate.documentFee +
            rate.billofLadingFee +
            rate.destinationBillofLadingFee) *
          (1 + rate.chargeFee / 100),
      };

      const agent = await Agent.findOne({ status: "Default" });

      if (agent) {
        customAduanaServices = {
          id: agent._id,
          vehicleRate: agent.vehicleRate,
          classifyProduct: agent.classifyProduct,
          rojoSelective: agent.rojoSelective,
          review: agent.review,
          permitsCost: agent.permitsCost,
          unit: 1,
          amount: agent.vehicleRate,
        };
      }
    }
    else {
      rate = await Rate.findOne({ _id: rateId });
      
      if (!rate) throw createHttpError(404, "Rate not found");

      const volume = calculatePallet(pallets);

      exportAndFreight = {
        id: rate._id,
        freightRate: rate.freightRate,
        portFee: rate.portFee,
        documentFee: rate.documentFee,
        billofLadingFee: rate.billofLadingFee,
        destinationBillofLadingFee: rate.destinationBillofLadingFee,
        chargeFee: rate.chargeFee,
        unit: 1,
        amount:
          (volume * rate.freightRate +
            volume * rate.portFee +
            rate.documentFee +
            rate.billofLadingFee +
            rate.destinationBillofLadingFee) *
          (1 + rate.chargeFee / 100),
      };

      const agent = await Agent.findOne({ status: "Default" });

      if (agent) {
        customAduanaServices = {
          id: agent._id,
          classifyProduct: agent.classifyProduct,
          rojoSelective: agent.rojoSelective,
          review: agent.review,
          permitsCost: agent.permitsCost,
          unit: 1,
          amount: agent.classifyProduct,
        };
      }
    }

    const quote = await new Quote({
      type,
      warehouse: rate.exportLocation,
      countryOfImport: rate.destinationCountry,vehicleYear,
      VINNumber,
      vehicleSize,
      knowAduanaServices,
      startAndDrive,
      vehicleModel,
      image,

      pallets,
      typeOfMerchandise,
      commercialInvoice,
      statusOfShipment,
      collectionTransport,
      description,
      name,
      email,
      phone,
      exportAndFreight,
      customAduanaServices,
      consolidationAddress: rate.consolidationAddress,
      heatTreatPalletRequire: rate.heatTreatPalletRequire,
    }).save();

    res.json({
      message: "Quote Information",
      data: quote,
    });

    await sendMail({
      to: "paulruet58@gmail.com, lissette@casaenvios.com, edwinp@casaenvios.com",
      subject: "Casaenvios Quote",
      template: "mailTemplate",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
