import Box from "@mui/material/Box";
import React from "react";
import UserList from "../components/UserManage/UserList";

export default function UserPage() {
  return (
    <div className="bgcolor">
      <Box height={60} />
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Accounts List</h1>
          <UserList />
        </Box>
      </Box>
    </div>
  );
}
