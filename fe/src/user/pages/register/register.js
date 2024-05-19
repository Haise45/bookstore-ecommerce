import React, { useState, useEffect } from 'react';
import './style.scss'
import { authenticateApi } from '../../api/api.js';
import {useNavigate, Link} from 'react-router-dom'
const RegisterForm = () => {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        e.target.classList.remove('error')
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if (formData.password.length < 6){
                const elementArray = Array.from(document.querySelectorAll('.password_body'));
                elementArray.forEach((e) => e.classList.add('error')); // Thêm class 'error' cho mỗi phần tử
                alert('Password must be more than 6 characters')
                return
            }
            if (formData.password !== formData.confirmPassword) {
                const elementArray = Array.from(document.querySelectorAll('.password_body'));
                elementArray.forEach((e) => e.classList.add('error'));
                alert('Password and Confirm password must be the same')
                return
            }
            const params = {
                'email': `${formData.email}`,
                'password': `${formData.password}`,
                'firstName': `${formData.firstName}`,
                'lastName': `${formData.lastName}`,
            }

            const response = await authenticateApi.resgister(params)
            if (response.status === 201) {
                alert('Check your email to activate your account')
                navigate('/login')
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const elements = document.querySelectorAll('.email');
                elements.forEach((element) => {
                    element.classList.add('error');
                });
                alert('Email registered for the account')
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
                'align-items': 'center',
                'margin-left': '50px',
                'font-size': '20px',
            }}>
                <h2>Bookstore</h2>
            </div>
            <div style={{ height: `80%`, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#9C90D0', margin: '' }}>
                <div style={{ width: '70%', height: `100%` }} className="left">
                    <h1>Bookstore</h1>
                    <span>Reputable and quality book store</span>
                </div>
                <div style={{ width: '30%', }} className="right">

                    <h2>Resgister</h2>

                    <form onSubmit={handleSubmit}>
                        <div className='lastname'>
                            <span className='lastname_header'>Last Name</span>
                            <input
                                placeholder="Last name"
                                type="text"
                                name="lastName"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='firstname'>
                            <span className='firstname_header'>First Name</span>
                            <input
                                placeholder="First name"
                                type="text"
                                name="firstName"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className='email'>
                            <span className='email_header'>Email</span>
                            <input
                                placeholder="Email"
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={

                                    handleChange
                                }
                            />
                        </div>

                        <div className='password'>
                            <span className='password_header'>Password</span>
                            <input
                                className='password_body'
                                placeholder="Password"
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                        
                            />
                        </div>

                        <div className='passwordconfirm'>
                            <span className='passwordconfirm_header'>Confirm password</span>
                            <input
                                className='password_body'
                                placeholder="Confirm password"
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit">Register</button>

                        <div className="hr">

                            <hr></hr>
                            <span className="or">Or</span>
                        </div>
                        <div>
                            <span>Already have an account? </span>
                            <Link to='/login'>Login</Link>
                        </div>
                    </form>

                </div>
            </div>
            <div style={{ height: `10%` }}></div>
        </div>
    );
}
export default RegisterForm;
