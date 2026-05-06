class Property {
  constructor({ id, title, price, location, available, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.price = Number(price);
    this.location = location;
    this.available = available;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAvailable() {
    return this.available === true;
  }
}

module.exports = Property;
