import React, { useState, useEffect } from "react";
import "./style.css";
import "./bootstrap.min.css";

import pizzaImage from "./images/pizza.jpg";
import hamburgerImage from "./images/Hamburger.jpg";
import breadImage from "./images/bread.jpg";
import cakeImage from "./images/Cake.jpg";

type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const products: Product[] = [
  // chỉnh số lượng vẫn dùng được bình thường
  { id: 1, name: "Pizza", price: 30, quantity: 5, image: pizzaImage },
  { id: 2, name: "Hamburger", price: 15, quantity: 0, image: hamburgerImage },
  { id: 3, name: "Bread", price: 20, quantity: 10, image: breadImage },
  { id: 4, name: "Cake", price: 10, quantity: 0, image: cakeImage },
];

const ShoppingCart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: string;
  } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          setNotification({
            message: "Quantity exceeds available stock",
            type: "danger",
          });
          setTimeout(() => setNotification(null), 3000);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.quantity) {
          setNotification({
            message: "Quantity exceeds available stock",
            type: "danger",
          });
          setTimeout(() => setNotification(null), 3000);
          return prevCart;
        }
        return [...prevCart, { product, quantity }];
      }
    });
    setNotification({ message: "Add to cart successfully", type: "success" });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateCart = (product: Product, quantity: number) => {
    if (quantity > product.quantity) {
      setNotification({
        message: "Quantity exceeds available stock",
        type: "danger",
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === product.id ? { ...item, quantity } : item
      )
    );
    setNotification({ message: "Update successfully", type: "warning" });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteFromCart = (product: Product) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== product.id)
    );
    setNotification({ message: "Delete successfully", type: "danger" });
    setTimeout(() => setNotification(null), 3000);
  };

  const cartTotalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Shopping Cart</h1>
      </div>
      <div className="row">
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h1 className="panel-title">List Products</h1>
            </div>
            <div className="panel-body" id="list-product">
              {products.map((product) => (
                <div key={product.id} className="media product">
                  <div className="media-left">
                    <a href="#">
                      <img
                        className="media-object"
                        src={product.image}
                        alt={product.name}
                      />
                    </a>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">{product.name}</h4>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      At dicta odit, optio omnis repudiandae, aperiam!
                    </p>
                    <span className="price">{product.price} USD</span>
                    <span className="quantity">
                      {" "}
                      - In stock: {product.quantity}
                    </span>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      {product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h1 className="panel-title">Your Cart</h1>
            </div>
            <div className="panel-body" id="my-cart">
              {cart.length === 0 ? (
                <p>Chưa có sản phẩm trong giỏ hàng</p>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={item.product.id}>
                        <td>{index + 1}</td>
                        <td>{item.product.name}</td>
                        <td>{item.product.price} USD</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateCart(
                                item.product,
                                parseInt(e.target.value)
                              )
                            }
                            min="1"
                            max={item.product.quantity}
                          />
                        </td>
                        <td>{item.product.price * item.quantity} USD</td>
                        <td>
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleUpdateCart(item.product, item.quantity)
                            }
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteFromCart(item.product)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot id="my-cart-footer">
                    <tr>
                      <td colSpan={5}>
                        There are <b>{cart.length}</b> items in your shopping
                        cart.
                      </td>
                      <td className="total-price text-left">
                        {cartTotalPrice} USD
                      </td>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
          {notification && (
            <div
              className={`alert alert-${notification.type}`}
              role="alert"
              id="mnotification"
            >
              {notification.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
