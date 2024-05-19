import React, { memo, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import "react-multi-carousel/lib/styles.css";
import './style.scss'
import Header from '../theme/header';
import Footer from '../theme/footer';
import Cookies from 'universal-cookie';
import { bookApi, cartApi } from '../../api/api';
import { formatCurrency } from '../../../user/utils/format_tien';
const BookDetail = () => {
    const [book, setBook] = useState()
    const [cart, setCart] = useState();
    const [quantity, setQuantity] = useState(1)
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('id');
    const [bookSomeGenre, setBookSomeGenre] = useState()
    const [amount, setAmount] = useState(0)
    const getBooksByWord = async () => {
        try {
            axios.defaults.withCredentials = true;
            const response = await bookApi.getById(searchTerm);
            setBook(response.data);
        } catch (error) {
            // Xử lý lỗi từ API
            console.error("Error fetching books:", error);
            // Gán giá trị rỗng cho book hoặc thực hiện một xử lý khác tùy thuộc vào yêu cầu của bạn
            setBook([]);
        }
    };
    useEffect(() => {
        // Gọi hàm async bên trong useEffect
        const fetchData = async () => {
            await getBooksByWord();
        };

        fetchData();

        // Truyền searchTerm vào dependency array nếu bạn muốn cập nhật dữ liệu khi searchTerm thay đổi
    }, [searchTerm]);
    const getBooks = async () => {
        axios.defaults.withCredentials = true;
        const response = await bookApi.getAll();

        const genre = [];
        if (book) {
            book.categories.forEach((item) => {
                genre.push(item.name);
            });
        }

        const bs = genre.map((item) => {
            // return response.data.data.filter((b) => {
            //     // return b.categories.includes(item);
            // });
        });

        // Gộp các mảng thành một mảng duy nhất
        const mergedArray = bs.reduce((accumulator, currentValue) => {
            return accumulator.concat(currentValue);
        }, []);

        // Đảm bảo mergedArray không rỗng trước khi gán
        if (mergedArray.length > 0) {
            setBookSomeGenre(mergedArray);
        }

    };

    useEffect(() => {
        getBooks()
    }, [searchParams])
    useEffect(() => {
        getCart();
    }, []);

    const getCart = async () => {
        const isLoggedIn = cookies.get('token')

        try {
            let cartResponse;
            if (isLoggedIn) {
                axios.defaults.withCredentials = true;
                // Người dùng đã đăng nhập
                cartResponse = await cartApi.getAll();
            } else {
                // Người dùng chưa đăng nhập
                axios.defaults.withCredentials = true;
                cartResponse = await cartApi.getAllNoToken()
            }

            const cartData = cartResponse;
            let sumQuantityBooks = 0
            const cart = {
                products: cartData.data.map(cartProduct => {
                    sumQuantityBooks += parseInt(cartProduct.quantity)
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
            setCart(cart);
            setAmount(sumQuantityBooks)
        } catch (error) {
            console.error('Lỗi khi kiểm tra và lấy dữ liệu giỏ hàng:', error);
        }
    };
    const cookies = new Cookies()
    const handleAddToCart = async (product, quantity) => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const isLoggedIn = cookies.get('token')

        axios.defaults.withCredentials = true;
        try {
            if (isLoggedIn) {
                if (quantity === 1) {
                    // Gửi request POST đến API endpoint để thêm sản phẩm vào cơ sở dữ liệu
                    const response = await cartApi.add(product._id)

                    if (response.status === 200) {

                        getCart()
                    }
                } else {

                    const existingProduct = cart.products.find(item => item.id === product._id)
                    if (existingProduct) {

                        const response = await cartApi.update(product._id, quantity)
                        if (response.status === 200) {
    
                            getCart()
                        }
                    } else {
                        const response = await cartApi.addHaveQuantity(product._id,quantity)
                        if (response.status === 200) {
                            if (response.status === 200) {

       
                                getCart()
                            }
                        }
                    }
                }
            } else {

                if (quantity === 1) {
                    // Gửi request POST đến API endpoint để thêm sản phẩm vào cơ sở dữ liệu
                    const response = await cartApi.addNoToken(product._id)

                    if (response.status === 200) {

       
                        getCart()
                    }
                } else {
      
                    const existingProduct = cart.products.find(item => item.id === product.id)
                    if (existingProduct) {
    
                        const response = await cartApi.updateNoToken(product._id, quantity)
                        if (response.status === 200) {
                      
                            getCart()
                        }
                    } else {
                        const response = await cartApi.addNoTokenHaveQuantity(product._id,quantity)
                        if (response.status === 200) {
                                getCart()
                        }
                    }
                }
            }
        } catch (error) {
            // Xử lý lỗi nếu request gặp vấn đề
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
            // Hiển thị thông báo lỗi cho người dùng hoặc xử lý lỗi khác tùy theo nhu cầu
        }
    }
    return (
        <>
            <Header amount={amount} />
            <div className='container'>
                {book && <ul className='content book'>
                    <li className='image' style={{ backgroundImage: `url(${book.image})` }}></li>
                    <li className='book_detail'>
                        <ul className='detail'>
                            <li className='name'>{book.name}</li>
                            <li className='price'>{formatCurrency(book.price)}</li>
                            <li className='categories'>
                                <div>categories:</div>
                                <ul>
                                    {book.categories.map((item, index) => (
                                        <li key={index}>{item.name}</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='button'>
                                <ul className='button_box'>
                                    <li>
                                        <button onClick={() => setQuantity(quantity - 1)}>-</button>
                                    </li>
                                    <li className='amount'>{quantity}</li>
                                    <li>
                                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                    </li>
                                </ul>
                            </li>
                            <li className='button_addtocart'>
                                <button onClick={() => handleAddToCart(book, quantity)}>Thêm vào giỏ hàng</button>
                            </li>
                            <li className='description'>{book.description}</li>
                        </ul>
                    </li>
                </ul>}
            </div>
            <Footer />
        </>
    )
}
export default memo(BookDetail)