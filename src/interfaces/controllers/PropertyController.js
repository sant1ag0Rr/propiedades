const propertyService = require("../../application/services/PropertyService");

class PropertyController {
  async getProperties(req, res) {
    const result = await propertyService.findAll(req.query);
    return res.json(result);
  }

  async getPropertyById(req, res) {
    const property = await propertyService.findById(req.params.id);
    return res.json(property);
  }

  async createProperty(req, res) {
    const property = await propertyService.create(req.body);
    return res.status(201).json(property);
  }

  async updateProperty(req, res) {
    const property = await propertyService.update(req.params.id, req.body);
    return res.json(property);
  }

  async deleteProperty(req, res) {
    await propertyService.remove(req.params.id);
    return res.status(204).send();
  }
}

module.exports = new PropertyController();
