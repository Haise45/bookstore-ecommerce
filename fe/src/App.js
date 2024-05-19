import React, { useEffect, useState } from "react";
import RouterCustom from "./router.js";
import Cookies from "universal-cookie";
const App = () => {
    const [role, setRole] = useState('');
    const cookies = new Cookies()
    // Hàm này sẽ được gọi khi component được tải lần đầu tiên
    useEffect(() => {
        const userRole = cookies.get('userRole');
        if (userRole) {
            console.log('role: ',userRole)
            setRole(userRole); // Nếu có vai trò từ cookie, cập nhật state
        }
    }, []); // Tham số thứ hai truyền vào useEffect là một mảng rỗng, đảm bảo hàm chỉ được gọi một lần
    return (
        <div>
            {/* Kiểm tra xem có vai trò hay không */}
            {<RouterCustom role={role} />}
        </div>
    );
};

export default App;