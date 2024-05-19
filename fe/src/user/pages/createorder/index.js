import React, { memo, useState, useEffect } from "react";
import Header from "../theme/header/index.js";
import Footer from "../theme/footer/index.js";
import axios from "axios";
import Cookies from "universal-cookie";
import './style.scss'
import { useNavigate, useLocation } from "react-router-dom";
import { cartApi } from "../../api/api.js";
import { formatCurrency } from "../../utils/format_tien.js";
const CreateOrder = () => {
    const [cart, setCart] = useState()
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)
    const navigate = useNavigate()
    const location = useLocation();
    const selectedBooks = location.state?.selectedBooks
    const cookies = new Cookies()
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
    const [language, setLanguage] = useState(0)
    useEffect(() => {
        getCart();
    }, []);
    const getCart = async () => {
        const isLoggedIn = cookies.get('token');
        try {
            let cartResponse;
            if (isLoggedIn) {
                axios.defaults.withCredentials = true;
                cartResponse = await cartApi.getAll();
            } else {
                axios.defaults.withCredentials = true;
                cartResponse = await cartApi.getAllNoToken()
            }
            const cartData = cartResponse;
            let sumQuantityBooks = 0;
            let sumPrice = 0;
            const cartProducts = await Promise.all(cartData.data.map((cartProduct) => {
                sumQuantityBooks += cartProduct.quantity

                return {
                    idcart: cartProduct.cart._id,
                    idcartitem: cartProduct._id,
                    id: cartProduct.book._id,
                    img: cartProduct.book.bookImage,
                    name: cartProduct.book.name,
                    author: cartProduct.book.author,
                    description: cartProduct.book.description,
                    price: cartProduct.book.price,
                    quantity: cartProduct.quantity
                };

            }));
            setAmount(sumQuantityBooks)
            const selectedBooksInCart = cartProducts.filter(item => selectedBooks.includes(item.idcartitem));
            selectedBooksInCart.map((item) => sumPrice += item.price * item.quantity)
            setPrice(sumPrice)
            setCart(selectedBooksInCart);
        } catch (error) {
            console.error('Lỗi khi kiểm tra và lấy dữ liệu giỏ hàng:', error);
        }
    };
    const handleOrder = async (arr) => {
        if (window.confirm("Are you sure you want to place this order?")) {
            try {
                for (const a of arr) {
                    axios.defaults.withCredentials = true;
                    await cartApi.checkout(a)
                }
                navigate('/cart')
            } catch (error) {
                console.error('Lỗi khi thực hiện thanh toán và xóa giỏ hàng:', error);
            }
        } else {
            return
        }

    }
    const handlePaymentMethodChange = (selectedMethod) => {
        setPaymentMethod(selectedMethod);
    };
    return (
        <>
            <Header amount={amount} />
            <div className="container" style={{ minHeight: '510px' }}>
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid',
                    borderRadius: '10px 10px 0 0'
                }}>Create order</div>
                <div className="orderpage_header">
                    <span>Quantity</span>
                    <span>Price</span>
                </div>
                <div className="list_book">
                    {cart ? (
                        cart.map((item, index) => (
                            <div key={index} className="book_detail">
                                <div className="img" style={{ backgroundImage: `url(${item.img})` }}></div>
                                <div className="book_detail_text">
                                    <div>{item.name}</div>
                                    <div>{item.author}</div>
                                </div>
                                <div className="quantity"><span>{item.quantity}</span></div>
                                <div className="price"><span>{formatCurrency((item.price * item.quantity), language)}</span></div>
                            </div>
                        ))
                    ) : (
                        <div>Can't connect to cart</div>
                    )}
                </div>
                <div className="box_payment_price">
                    <div className="payment_method">
                        <div className="">Payment methods:</div>
                        <select onChange={(e) => handlePaymentMethodChange(e.target.value)}>
                            <option value="cash_on_delivery">Pay on delivery</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="price_box">
                        {/* <div>Tổng tiền:</div> */}
                        <div>{formatCurrency(price, language)}</div>
                    </div>
                </div>
                <div className="button_box">
                    <button className="button_cancel" style={{ cursor: 'pointer', borderRadius: '10px' }} onClick={() => { if (window.confirm("Want to keep ordering?")) { return } else { navigate('/cart') } }}>Cancel</button>
                    <button className="button_order" style={{ cursor: 'pointer', borderRadius: '10px' }} onClick={() => handleOrder(selectedBooks)}>Order</button>
                </div>
            </div >
            <Footer />
        </>
    )
}
export default memo(CreateOrder)