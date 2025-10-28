const User = require('./User');
const Pet = require('./Pet');
const Product = require('./Product');
const Cart = require('./Cart');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Donation = require('./Donation');
const Adoption = require('./Adoption');

// User Associations
User.hasMany(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Donation);
Donation.belongsTo(User);

User.hasMany(Adoption);
Adoption.belongsTo(User);

// Pet Associations
Pet.hasMany(Adoption);
Adoption.belongsTo(Pet);

// Cart Associations
Cart.hasMany(CartItem);
CartItem.belongsTo(Cart);

CartItem.belongsTo(Product);
Product.hasMany(CartItem);

// Order Associations
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

OrderItem.belongsTo(Product);
Product.hasMany(OrderItem);

module.exports = {
    User,
    Pet,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Donation,
    Adoption
};