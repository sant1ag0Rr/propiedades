const propertyService = require("../services/propertyService");

const getProperties = async (req, res) => {
  const result = await propertyService.findAll(req.query);
  return res.json(result);
};

const getPropertyById = async (req, res) => {
  const property = await propertyService.findById(req.params.id);
  return res.json(property);
};

const createProperty = async (req, res) => {
  const property = await propertyService.create(req.body);
  return res.status(201).json(property);
};

const updateProperty = async (req, res) => {
  const property = await propertyService.update(req.params.id, req.body);
  return res.json(property);
};

const deleteProperty = async (req, res) => {
  await propertyService.remove(req.params.id);
  return res.status(204).send();
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
