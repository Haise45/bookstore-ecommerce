import { memo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./styles.scss"
import { FaUserCircle, FaShoppingCart } from "react-icons/fa"
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "universal-cookie";
import { categoryApi } from "../../../api/api";
const API_URL = 'https://fakestoreapi.com/products';
const Header = ({amount}) => {
    const [data, setData] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const cookies = new Cookies()
    // const [quantity, setQuantity] = useState(amount)
    const [name, setName] = useState();
    useEffect(() => {
        const tokenExists = cookies.get('token');
        if (tokenExists) {
            const initialName = cookies.get('firstname') +' '+ cookies.get('lastname'); // Kiểm tra xem cookie 'name' có tồn tại không
            setName(initialName);
        }
    }, []);
    useEffect(()=>{
        if (cookies.get('token')) {
            setLoggedIn(true)
        }
    },[])
    useEffect(() => {
        const fetchData = async () => {
            try {
                axios.defaults.withCredentials = true
                const response = await categoryApi.getAll();
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);
    const handleSearch = (str, event) => {
        event.preventDefault();
        // Chuyển hướng sang trang FindPage và truyền tham số tìm kiếm
        navigate(`/find?search=${str}`);
    };
    
    const handleLogout = () => {
        cookies.remove('token')
        cookies.remove('userRole')
        cookies.remove('username')
        cookies.remove('firstname')
        cookies.remove('lastname')
        cookies.remove('connect.sid')
        window.location.href = "/"
    };
    const handleLogin = () => {
        window.location.href = "/login"
    };
    const updateAmount = (quantity) =>{
        if (quantity > 99) {
            return '+99'
        } else {
            return `${quantity}`
        }
    }
    
    return (
        <div className="header">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-xl-3 col-xs-12 header__left">
                        <div className="header__logo">
                            <Link to="/">
                                <h1>BookStore</h1>
                            </Link>
                        </div>
                        <div className="categories__container">
                            <BiSolidCategory />
                            <ul className="categories__drop">
                                <li className="categories__drop_header">Directory</li>
                                {data.map((genre, index) => (
                                    <li key={index} className="categories__drop_item">
                                        <Link to={`/find?category=${genre._id}`}>{genre.name}</Link>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-6 col-xl-6 col-xs-12 header__mid">
                        <form className="headre__mid_container" onSubmit={(e)=>handleSearch(searchTerm, e)}>
                            <input
                                type="text"
                                className="header__mid_input"
                                placeholder=" Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}></input>
                            <button type="submit" className="button-submit" >
                                <FaMagnifyingGlass />
                            </button>
                        </form>
                    </div>
                    <div className="col-lg-3 col-xl-3 col-xs-12 header__right">
                        <div className="header__cart">
                            <div>

                                <Link to="/cart">
                                    <FaShoppingCart />
                                    <span className="cart__item_amount">{updateAmount(amount)}</span>
                                    {/* <span className="header__cart_text">Giỏ hàng({updateAmount(amount)})</span> */}
                                </Link>

                            </div>

                        </div>
                        <div className="header__user">

                            <div className="boxuser">
                                <FaUserCircle />
                                {name ? <span className="header__user_text">{name}</span> :<span className="header__user_text">Account</span>}
                            </div>
                            {cookies.get('token') ? <ul className="header__user__dropdow">
                                <li >
                                    <button style={{cursor: 'pointer'}} onClick={()=>{navigate('/account')}}>
                                    {cookies.get('username')}
                                    </button>
                                </li>
                                <li>
                                    <button style={{cursor: 'pointer'}} onClick={()=> handleLogout()}>

                                       Logout
                                    </button>
                                </li>
                            </ul>:<ul className="header__user__dropdow">
                                <li>
                                    <button style={{cursor: 'pointer'}} onClick={()=> handleLogin()}>
                                    Login
                                    </button>
                                </li>
                                <li>
                                    <button style={{cursor: 'pointer'}} onClick={()=> navigate('/register')}>
                                        Register
                                    </button>
                                </li>
                            </ul>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default memo(Header)