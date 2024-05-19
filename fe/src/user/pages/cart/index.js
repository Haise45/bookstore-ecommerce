import { memo, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { formatCurrency } from "../../../user/utils/format_tien"
import "./styles.scss"
import axios from "axios"
import Cookies from 'universal-cookie'
import Header from "../theme/header"
import Footer from "../theme/footer"
import { bookApi, cartApi } from "../../api/api"
const Cart = () => {
    const cookies = new Cookies()
    const [cart, setCart] = useState();
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [totalBooksSelected, setTotalBooksSelected] = useState(0);
    const navigate = useNavigate()
    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedBooks((prevSelectedBooks) => [...prevSelectedBooks, value]);
            const arr = cart.products
            const foundProduct = arr.find(product => product.idcartitem === value);
            if (foundProduct) {
                setTotalBooksSelected((prevTotalBooksSelected) => prevTotalBooksSelected + foundProduct.quantity);
                setTotalPrice((prevTotalPrice) => prevTotalPrice + (foundProduct.quantity * foundProduct.price));

            }
        } else {
            setSelectedBooks((prevSelectedBooks) =>
                prevSelectedBooks.filter((bookId) => bookId !== value)
            );
            // Tìm sản phẩm trong giỏ hàng có id là value
            const foundProduct = cart.products.find(product => product.idcartitem === value);
            // Nếu sản phẩm được tìm thấy, cập nhật totalBooks bằng số lượng của sản phẩm đó
            if (foundProduct) {
                setTotalBooksSelected((prevTotalBooksSelected) => prevTotalBooksSelected - foundProduct.quantity);
                setTotalPrice((prevTotalPrice) => prevTotalPrice + (foundProduct.quantity * foundProduct.price));
            }
        }
    }
    const handleSubmitOrder = () => {
        const isLoggedIn = cookies.get('token')
        if (selectedBooks.length < 1) {
            alert("Please select products to order")
            return
        }
        if (isLoggedIn) {
            navigate('/createorder', { state: { selectedBooks } });
        } else {
            alert("You're not signed in. Please log in to continue.");
        }
    };
    
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
                cartResponse = await cartApi.getAllNoToken();
            }
            const cartData = cartResponse;
            let sumQuantityBooks = 0;
            let sumPrice = 0;
            const cartProducts = await Promise.all(cartData.data.map(async (cartProduct) => {
                sumQuantityBooks += parseInt(cartProduct.quantity)
                sumPrice += cartProduct.quantity * cartProduct.book.price

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

            setTotalBooks(sumQuantityBooks)
            setCart({ products: cartProducts });
        } catch (error) {
            console.error('Lỗi khi kiểm tra và lấy dữ liệu giỏ hàng:', error);
        }
    };
    const Arrayproducts = []
    if (cart && cart.products) {
        cart.products.forEach((cartproduct) => {
            Arrayproducts.push({
                products: cartproduct,
            })
        });
    } else {
        console.log('Không có sản phẩm trong giỏ hàng.')
    }
    const handleAdd = async (product) => {
        const isLoggedIn = cookies.get('token')

        try {
            if (isLoggedIn) {
                axios.defaults.withCredentials = true;
                const response = await cartApi.add(product.id)
                if (response.status === 200) {
    
                    getCart()
                }
            } else {
                axios.defaults.withCredentials = true;
                const response1 = await cartApi.addNoToken(product.id);
                if (response1.status === 200) {

                    getCart()
                }
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        }
    }
    const handleSubtract = async (product) => {
        const isLoggedIn = cookies.get('token')
        const updateQuantity = product.quantity - 1
        try {
            if (isLoggedIn) {
                if (updateQuantity < 1) {
                    if (window.confirm("Are you sure you want to remove this product from your cart?")) {
                        axios.defaults.withCredentials = true;
                        const responsedelete = await cartApi.delete(product.id);
                        if (responsedelete.status === 200) {
        
                            getCart();
                            return;
                        }
                    } else {
                        return;
                    }
                }
                axios.defaults.withCredentials = true;
                const response = await cartApi.update(product.id, updateQuantity)
                if (response.status === 200) {

                    getCart()
                }
            } else {
                if (updateQuantity < 1) {
                    if (window.confirm("Are you sure you want to remove this product from your cart?")) {
                        axios.defaults.withCredentials = true;
                        const responsedelete = await cartApi.deleteNoToken(product.id);
                        if (responsedelete.status === 200) {
                            getCart();
                            return;
                        }
                    } else {
                        return;
                    }
                }
                axios.defaults.withCredentials = true;
                const response1 = await cartApi.updateNoToken(product.id, updateQuantity)
                if (response1.status === 200) {

                    getCart()
                }
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
        }
    }
    const handleDelete = async (product) => {
        const isLoggedIn = cookies.get('token');
        if (isLoggedIn) {
            axios.defaults.withCredentials = true;
            if (window.confirm("Are you sure you want to remove this product from your cart?")) {
                const responsedelete = await cartApi.delete(product.id);
                if (responsedelete.status === 200) {
                    getCart();
                }
            }
        } else {
            axios.defaults.withCredentials = true;
            if (window.confirm("Are you sure you want to remove this product from your cart?")) {
                const responsedelete = await cartApi.deleteNoToken(product.id);
                if (responsedelete.status === 200) {
                    getCart();
                }
            }
        }
    }
    
    return (
        <>
            <Header amount={totalBooks} />
            <div className="cart">
                <div className="container">
                    <div className="cart__header">Cart</div>
                    <div className="cart__content">
                        <div className="col-xl-9 col-lg-9 container__cart_left">
                            {Arrayproducts.length > 0 ? Arrayproducts.map((product, index) => (
                                <ul className=" cart__left_content" key={index}>
                                    {cookies.get('token') && <li className="cart__content_checkbox">
                                        <input type="checkbox" id={`book-${product.products.idcartitem}`} onChange={handleCheckboxChange} value={product.products.idcartitem}></input>
                                    </li>}
                                    <li className="cart__content_pic" style={{ backgroundImage: `url(${product.products.img})` }}></li>
                                    <li className="cart__content_text">
                                        <ul>
                                            <li>{product.products.name}</li>
                                            <li>{product.products.author}</li>
                                            <li><button style={{cursor: 'pointer'}} onClick={() => { handleDelete(product.products) }} >Delete</button></li>
                                        </ul>
                                    </li>
                                    <li className="cart__content_price">{formatCurrency(product.products.price)} /book</li>
                                    <li className="cart__content_button">
                                        <ul className="button__box">
                                            <li className="button button_down">
                                                <button onClick={() => handleSubtract(product.products)}>-</button>
                                            </li>
                                            <li className="amount">
                                                <div>
                                                    {product.products.quantity}
                                                </div>
                                            </li>
                                            <li className="button button_up" >
                                                <button onClick={() => handleAdd(product.products)}>+</button>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            )) : <div style={{margin: '10% 0 0 60%'}}>No products in the cart</div>}
                        </div>

                        <div className="col-xl-3 col-lg-3 container__cart_right">
                        {Arrayproducts.length !== 0 ? (
                                cookies.get('token') ? (
                                    <ul>
                                        <li>{totalBooksSelected} books</li>
                                        <li>{formatCurrency(totalPrice)}</li>
                                        <li>(Shipping not included)</li>
                                        <button style={{cursor: 'pointer'}} onClick={() => handleSubmitOrder()}>Order</button>
                                    </ul>
                                ) : (
                                    <div style={{backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <div>Please log in to place an order</div>
                                    </div>
                                )
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
export default memo(Cart)