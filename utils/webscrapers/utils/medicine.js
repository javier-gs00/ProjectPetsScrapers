// Create the object constructor to save a custom JSON file
function Medicine (name, price, link, category, brand, image, store) {
    this.name = name;
    this.price = price;
    this.link = link;
    this.category = 'Medicine';
    this.brand = brand;
    this.image = image;
    this.store = store;
}

module.exports = Medicine