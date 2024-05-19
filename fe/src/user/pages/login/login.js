import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, Redirect, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import { authenticateApi, cartApi } from "../../api/api.js";
import './style.scss'
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cart, setCart] = useState()
    const cookies = new Cookies()
    const getCart = async () => {
        try {
            let cartResponse;

            axios.defaults.withCredentials = true;
            cartResponse = await cartApi.getAllNoToken();

            const cartData = cartResponse;
    
            if(cartData){const cart1 = {
                products: cartData.data.map(cartProduct => {
                    return {
                        // idcart: cartProduct.cart.id,
                        idcartitem: cartProduct.id,
                        id: cartProduct.book._id,
                        img: cartProduct.book.bookImage,
                        name: cartProduct.book.name,
                        author: cartProduct.book.author,
                        description: cartProduct.book.description,
                        price: cartProduct.book.price,
                        quantity: cartProduct.quantity
                    };
                })
            };
            setCart(cart1);}
        } catch (error) {
            console.error('Lỗi khi kiểm tra và lấy dữ liệu giỏ hàng:', error);
        }
    };

    useEffect(() => {
        getCart()
    }, [])
    const handleAddToCart = async (product, quantity) => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const isLoggedIn = cookies.get('token')
        axios.defaults.withCredentials = true;
        try {
            if (isLoggedIn) {
                    const response = await cartApi.addHaveQuantity(product.id,quantity);
                    if (response.status === 200) {
                        getCart()
                    }
            } else {
            }
        } catch (error) {
            // Xử lý lỗi nếu request gặp vấn đề
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            // Hiển thị thông báo lỗi cho người dùng hoặc xử lý lỗi khác tùy theo nhu cầu
        }
    }
    const handleDeleteItemCartSession = async (product) => {

        axios.defaults.withCredentials = true
        const responsedelete = await cartApi.deleteNoToken(product.id)
        // if (responsedelete.status === 200) {
        //     console.log('Sản phẩm đã được xoa khoi giỏ hàng thành công:', responsedelete.data);
        // }
    }
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            axios.defaults.withCredentials = true;
            const params = {
                "email": `${username}`,
                "password": `${password}`
            }
            const response = await authenticateApi.authen(params)
            if (response.status === 200) {
                cookies.set('userRole', response.data[0].role, { path: '/', maxAge: 604800 }); // expires in 7 days
                cookies.set('firstname', response.data[0].firstName, { path: '/', maxAge: 604800 }); // expires in 7 days
                cookies.set('lastname', response.data[0].lastName, { path: '/', maxAge: 604800 }); // expires in 7 days
                cookies.set('username', response.data[0].email, { path: '/', maxAge: 604800 }); // expires in 7 days
                cookies.set('token', response.token, { path: '/', maxAge: 604800 }); // expires in 7 days
    
        
                if (cart) {
                    cart.products.forEach((element) => {
                        handleAddToCart(element, element.quantity)
                        handleDeleteItemCartSession(element)
                    })
                }
            }
            window.location.href = '/';
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const elements = document.querySelectorAll('.input-box');
                elements.forEach((element) => {
                    element.classList.add('error');
                });
            } else {
                console.log('loi dang nhap: ', error);
            }
        }
    };
    return (
        <div className="containe" style={{ height: `1064px` }}>
            <div style={{
                height: `10%`,
                display: 'flex',
                alignItems: 'center',
                marginLeft: '50px',
                fontSize: '20px',
            }}>
                <h2>Bookstore</h2>
            </div>
            <div style={{ height: `80%`, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#9C90D0', margin: '' }}>
                <div style={{ width: '70%', height: `100%` }} className="left">
                    <h1>Bookstore</h1>
                    <span>Reputable and quality book store</span>
                </div>
                <div style={{ width: '30%', }} className="right">

                    <h2>Login</h2>
                    <form onSubmit={(e) => handleLogin(e)}>
                        <div className="username input-box">
                            <span className="username_header">Username</span>
                            <input
                                type="email"
                                placeholder="example@gmail.com"
                                required value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    e.target.parentElement.classList.remove('error');
                                }}
                            />
                        </div>
                        <div className="password input-box">
                            <span className="password_header">Password</span>
                            <input
                                type="password"
                                placeholder="example@123"
                                required 
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    e.target.parentElement.classList.remove('error');
                                }}
                            />
                            <Link>Forgot password</Link>
                        </div>

                        <button type="submit" className="btn_login">Login</button>
                        <div className="hr">

                            <hr></hr>
                            <span className="or">Or</span>
                        </div>
                        <div className="register">
                            <span className="register_header">Don't have an account yet? </span>
                            <Link to='/register'>Register</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ height: `10%` }}></div>
        </div>
    );
};

export default LoginPage;
