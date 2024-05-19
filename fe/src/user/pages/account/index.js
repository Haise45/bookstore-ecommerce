import React, { memo, useEffect, useState } from 'react'
import Header from '../theme/header/index.js'
import Footer from '../theme/footer/index.js'
import Cookies from 'universal-cookie'
import axios from 'axios'
import './style.scss'
import { bookApi, cartApi, orderApiForCustomer } from '../../api/api.js'
import { formatCurrency } from '../../utils/format_tien.js'
const Account = () => {
    const cookies = new Cookies()
    const [amount, setAmount] = useState(0)
    const [orders, setOrders] = useState()
    const [language, setLanguage] = useState(0)
    const getCart = async () => {
        const isLoggedIn = cookies.get('token');
        try {
            let cartResponse;
            if (isLoggedIn) {
                axios.defaults.withCredentials = true;
                // Người dùng đã đăng nhập
                cartResponse = await cartApi.getAll();
            } else {
                // Người dùng chưa đăng nhập
                axios.defaults.withCredentials = true;
                cartResponse = await cartApi.getAll()
            }

            const cartData = cartResponse;
            let sumQuantityBooks = 0;
            const cart1 = {
                products: cartData.data.map(cartProduct => {
                    sumQuantityBooks += cartProduct.quantity
                    return {
                        id: cartProduct.book.id,
                        img: cartProduct.book.bookImage,
                        name: cartProduct.book.name,
                        author: cartProduct.book.author,
                        description: cartProduct.book.description,
                        price: cartProduct.book.price,
                        quantity: cartProduct.quantity
                    };
                })
            };
            setAmount(sumQuantityBooks)
        } catch (error) {
            console.error('Lỗi khi kiểm tra và lấy dữ liệu giỏ hàng:', error);
        }
    };
    useEffect(() => {
        getCart()
    }, [])
    useEffect(() => {
        getOrder()
    }, [])
    const getOrder = async () => {
        const isLoggedIn = cookies.get('token')
        if (isLoggedIn) {

            try {
                axios.defaults.withCredentials = true
                const response = await orderApiForCustomer.getAll(isLoggedIn);
                if (response.status === 200) {
                    setOrders(response.data)
                }
            } catch (e) {
                console.error('Lỗi khi lấy đơn hàng:', e);
            }
        }
    }
    const handleCancel = async (id) => {
        try{
            if(window.confirm("Are you sure you want to cancel your order?")){
                const response = await orderApiForCustomer.cancel(id)
                if (response.status === 200) {
                    getOrder()
                }
            } else {
                return
            }
        } catch (e) {
            console.log('error: ',e)
        }
    }
    return (
        <>
            <Header amount={amount} />
            {cookies.get('token') ?
                <div className='container' style={{minHeight: '650px'}}>
                    <div className='box_user'>
                        <div className='box_user_name'>
                            <div style={{ marginRight: '10px' }}>Name:</div>
                            <div>{cookies.get('firstname') + " " + cookies.get('lastname')}</div>
                        </div>
                        <div className='box_user_email'>

                            <div style={{ marginRight: '10px' }}>Email:</div>
                            <div>{cookies.get('username')}</div>
                        </div>
                        <div className='box_user_sdt'>

                            <div style={{ marginRight: '10px' }}>Phone:</div>
                            <div>0582132246</div>
                        </div>
                        <div className='box_user_bird'>

                            <div style={{ marginRight: '10px' }}>Birthday:</div>
                            <div>25/02/2003</div>
                        </div>
                        <div className='box_user_address'>

                            <div style={{ marginRight: '10px' }}>Address:</div>
                            <div>Phuoc Tan 1, Tan Hung Ward, Ba Ria City, BRVT Province</div>
                        </div>
                    </div>
                    <div className='box_user_orders'>

                        {orders &&
                            <div className='box_user_orders_header'>All orders</div>
                        }
                        {orders &&

                            <ul style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                <li style={{ width: '8%', textAlign: 'center' }}>Quanty</li>
                                <li style={{ width: '12%', textAlign: 'center' }}>Price</li>
                                <li style={{ width: '12%', textAlign: 'center' }}>Into Money</li>
                            </ul>}
                        <div className='box_user_orders_body'>
                            {orders && orders.map((order, index) => (
                                <div className='box_book'>
                                    <div className='book_img' style={{ backgroundImage: `url(${order.bookList.bookImage})` }}></div>
                                    <div className='book_detail'>
                                        <div className='detail'>
                                            <div className='name_author'>
                                                <div>{order.bookList.name}</div>
                                                <div>{order.bookList.author}</div>
                                            </div>
                                            <div className='book_quantity' style={{ textAlign: 'center'}}>{(order.payment / order.bookList.price)}</div>
                                    
                                            <div className='price_payment' >
                                                <div style={{ textAlign: 'center' }}>{formatCurrency((order.payment / (order.payment / order.bookList.price)) + (order.payment % (order.payment / order.bookList.price)),language)}</div>
                                                <div style={{ textAlign: 'center' }}>{formatCurrency(order.payment, language)}</div>
                    
                                            </div>
                                        </div>
                                        <div className='box_status'>
                                            <div className='status'>
                                                <div style={{ marginRight: '10px' }}>Condition:</div>
                                                {order.status === 'PENDING' ?
                                                    <div>PENDING</div> :
                                                    order.status === 'PROCESSING' ?
                                                        <div>PROCESSING</div> :
                                                        order.status === 'DELIVERED' ?
                                                            <div>DELIVERED</div> :
                                                            <div>CANCELLED</div>
                                                }
                                            </div>
                                            <div>
                                                {order.status === 'PENDING' &&
                                                    <button style={{backgroundColor: 'white', border: '1px solid #9C90D0', padding: ' 10px 20px ', color: '#9C90D0'}} onClick={()=> handleCancel(order._id)}>Cancel</button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                            }
                        </div>

                    </div>
                </div>
                : <div>bạn chưa đăng nhập</div>}
            <Footer />
        </>
    )
}
export default memo(Account)