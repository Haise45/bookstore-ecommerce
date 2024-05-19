import Box from "@mui/material/Box";
import React from "react";
import OrderList from "../components/OrderManage/OrderList"

export default function OrderPage() {
  return (
    <div className="bgcolor">
      <Box height={60}/>
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Orders List</h1>
          <OrderList />
        </Box>
      </Box>
    </div>
  );
}
