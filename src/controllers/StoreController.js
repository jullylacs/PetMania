const { Product, Cart, CartItem, Order, OrderItem } = require('../models');

class StoreController {
    async index(req, res) {
        try {
            const products = await Product.findAll();
            return res.render('store/index', { products });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar produtos');
            return res.redirect('/');
        }
    }

    async listByCategory(req, res) {
        try {
            const products = await Product.findAll({
                where: { categoria: req.params.category }
            });
            return res.render('store/category', {
                products,
                category: req.params.category
            });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar produtos da categoria');
            return res.redirect('/store');
        }
    }

    async show(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                req.flash('error', 'Produto não encontrado');
                return res.redirect('/store');
            }
            return res.render('store/product', { product });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar produto');
            return res.redirect('/store');
        }
    }

    async addToCart(req, res) {
        try {
            let cart = await Cart.findOne({
                where: { userId: req.user.id, status: 'aberto' }
            });

            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.id,
                    status: 'aberto'
                });
            }

            const { quantidade } = req.body;
            const product = await Product.findByPk(req.params.productId);

            if (!product) {
                req.flash('error', 'Produto não encontrado');
                return res.redirect('/store');
            }

            await CartItem.create({
                cartId: cart.id,
                productId: product.id,
                quantidade: parseInt(quantidade, 10),
                precoUnitario: product.preco
            });

            req.flash('success', 'Produto adicionado ao carrinho');
            return res.redirect('/store/cart');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao adicionar produto ao carrinho');
            return res.redirect('/store');
        }
    }

    async showCart(req, res) {
        try {
            const cart = await Cart.findOne({
                where: { userId: req.user.id, status: 'aberto' },
                include: [{
                    model: CartItem,
                    include: [{ model: Product }]
                }]
            });

            if (!cart) {
                return res.render('store/cart', { cart: null });
            }

            return res.render('store/cart', { cart });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao carregar carrinho');
            return res.redirect('/store');
        }
    }

    async removeFromCart(req, res) {
        try {
            const cart = await Cart.findOne({
                where: { userId: req.user.id, status: 'aberto' }
            });

            if (!cart) {
                req.flash('error', 'Carrinho não encontrado');
                return res.redirect('/store/cart');
            }

            await CartItem.destroy({
                where: {
                    cartId: cart.id,
                    productId: req.params.productId
                }
            });

            req.flash('success', 'Produto removido do carrinho');
            return res.redirect('/store/cart');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao remover produto do carrinho');
            return res.redirect('/store/cart');
        }
    }

    async checkout(req, res) {
        try {
            const cart = await Cart.findOne({
                where: { userId: req.user.id, status: 'aberto' },
                include: [{
                    model: CartItem,
                    include: [{ model: Product }]
                }]
            });

            if (!cart || cart.CartItems.length === 0) {
                req.flash('error', 'Carrinho vazio');
                return res.redirect('/store/cart');
            }

            return res.render('store/checkout', { cart });
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao processar checkout');
            return res.redirect('/store/cart');
        }
    }

    async processCheckout(req, res) {
        try {
            const cart = await Cart.findOne({
                where: { userId: req.user.id, status: 'aberto' },
                include: [{
                    model: CartItem,
                    include: [{ model: Product }]
                }]
            });

            if (!cart || cart.CartItems.length === 0) {
                req.flash('error', 'Carrinho vazio');
                return res.redirect('/store/cart');
            }

            const { paymentMethod, address } = req.body;

            const order = await Order.create({
                userId: req.user.id,
                status: 'pendente',
                formaPagamento: paymentMethod,
                endereco: address,
                total: cart.CartItems.reduce((total, item) => {
                    return total + (item.quantidade * item.precoUnitario);
                }, 0)
            });

            for (const item of cart.CartItems) {
                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantidade: item.quantidade,
                    precoUnitario: item.precoUnitario
                });
            }

            await cart.update({ status: 'fechado' });

            req.flash('success', 'Pedido realizado com sucesso');
            return res.redirect('/store/orders');
        } catch (error) {
            console.error(error);
            req.flash('error', 'Erro ao processar pedido');
            return res.redirect('/store/checkout');
        }
    }
}

module.exports = new StoreController();