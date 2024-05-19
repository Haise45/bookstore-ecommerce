import { memo } from "react"
import {Link} from "react-router-dom"
import { FaFacebookSquare, FaInstagramSquare, FaTelegramPlane } from "react-icons/fa";
import "./styles.scss"
import Cookies from 'universal-cookie'
const Footer = () =>{
    const cookies = new Cookies()
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12">
                        <div className="footer__about">
                            <h1 className="footer__about__logo">BookStore</h1>
                            <ul>
                                <li>Address: Alley 24 Lam Son, Ho Chi Minh City</li>
                                <li>Email: thenghia25022003@gmail.com</li>
                                <li>Phone: 0582132246</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <div className="footer__widget">
                            <h6>Store</h6>
                            <ul>
                                <li>
                                    <Link to="">Contact</Link>

                                </li>
                                <li>
                                    <Link to="/">About Us</Link>
                                    
                                </li>
                                <li>
                                    <Link to="/">Business Products</Link>
                                    
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    {cookies.get('token') ?
                                    <Link to="/account">Account Information</Link>:
                                    <Link to='/register'>Register</Link>
                                    }
                                </li>
                                <li>
                                    <Link to="/cart">Cart</Link>
                                    
                                </li>
                                <li>
                                    <Link to="">Favorite products</Link>
                                    
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-xs-12">
                        {/* <div className="footer__widget">
                            <h6>Khuyến mãi</h6>
                            <p>Đăng ký nhận thông tin ở đây</p>
                            <form action="">
                                <div className="input-group">
                                    <input type="text" placeholder="Nhập email"/>
                                    <button type="submit" className="button-submit">Đắng ký</button>
                                </div>
                            </form>
                        </div>
                        <div className="footer__widget__social">
                            <div>
                            <FaFacebookSquare />
                            </div>
                            <div>
                            <FaInstagramSquare />
                            </div>
                            <div>
                            <FaTelegramPlane />
                            </div>
                        </div> */}
                    </div>
                    
                </div>
            </div>
        </footer>
    )
}
export default memo(Footer)