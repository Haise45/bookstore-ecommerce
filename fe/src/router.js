import { Routes, Route,Navigate } from "react-router-dom";
import HomePage from "./user/pages/homePage/index.js";
import { ROUTER } from "./user/utils/router.js";
import Cart from "./user/pages/cart/index.js";
import Findpage from "./user/pages/findpage/index.js";
import Bookdetail from "./user/pages/bookdetail/index.js";
import LoginPage from "./user/pages/login/login.js";
import Account from "./user/pages/account/index.js";
import Createorder from "./user/pages/createorder/index.js";
import RegisterForm from "./user/pages/register/register.js";
import Admin from "./admin/admin.js";

const renderUserRouter = ({ role }) => {
    const userRouter = [
        {
            path: ROUTER.USER.HOME,
            Comment: <HomePage />
        },
        {
            path: ROUTER.USER.CART,
            Comment: <Cart />
        },
        {
            path: ROUTER.USER.FIND,
            Comment: <Findpage />
        },
        {
            path: ROUTER.USER.DETAIL,
            Comment: <Bookdetail />
        },
        {
            path: ROUTER.USER.ACCOUNT,
            Comment: <Account/>
        },
        {
            path: ROUTER.USER.CREATEORDER,
            Comment: <Createorder/>
        }
    ];

    const adminRouter = [
        {
            path: ROUTER.ADMIN.HOME,
            Comment: <Admin />
        }
    ];
    
    return (
        <>
            {role === 'Admin' ? (
                <Routes>
                    {adminRouter.map((item, key) => (
                        <Route key={key} path={item.path} element={item.Comment} />
                    ))}
                </Routes>
            ) : (
                    <Routes>
                        {userRouter.map((item, key) => (
                            <Route key={key} path={item.path} element={item.Comment} />
                        ))}
                        <Route path={ROUTER.AUTHEN.LOGIN} element={<LoginPage/>}/>
                        <Route path={ROUTER.REGISTER.REGISTER} element={<RegisterForm/>}/>

                    </Routes>
                
            )}
        </>
    );
};

const RouterCustom = ({role}) => {
    return (
             renderUserRouter({ role })
    );
};

export default RouterCustom;
