import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import orderApi from "../../api/orderapi";
import userApi from "../../api/userapi";

function Row(props) {
  const { user, onDelete, userRole } = props;
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userOrders, setUserOrders] = useState([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      if (user.role === "Admin") {
        setErrorMessage("Cannot delete ADMIN account.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
        setOpenDialog(false);
        return;
      }
      await onDelete(user._id);
      setDeleteSuccessMessage(
        `${user.firstName} ${user.lastName} | ${user.role} deleted successfully`
      );
      setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleToggleOrder = async () => {
    try {
      const response = await orderApi.getUserOrders(user._id);
      const orders = response.data.map((order) => ({
        ...order,
        date: new Date(order.date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      }));
      setUserOrders(orders);
      setOpen(!open);
    } catch (error) {
      console.error("Error fetching user orders:", error);
    }
  };

  const isAdmin = userRole === "Admin";

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {isAdmin ? null : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={handleToggleOrder}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell component="th" scope="row">
          {user.firstName} {user.lastName}
        </TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell align="center">{user.role}</TableCell>
        <TableCell align="center">
          <Button variant="contained" color="error" onClick={handleOpenDialog}>
            Delete
          </Button>
        </TableCell>
      </TableRow>
      {!isAdmin && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={6}
            className="bgcolor"
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Orders from {user.firstName} {user.lastName}
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">ID</TableCell>
                        <TableCell align="center">Date</TableCell>
                        <TableCell align="center">Payment</TableCell>
                        <TableCell align="center">Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userOrders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell align="center">{order._id}</TableCell>
                          <TableCell align="center">{order.date}</TableCell>
                          <TableCell align="center">${order.payment}</TableCell>
                          <TableCell align="center">{order.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
      {deleteSuccessMessage && (
        <TableRow>
          <TableCell colSpan={5}>
            <Alert
              severity="success"
              variant="filled"
              sx={{
                mt: 2,
                position: "fixed",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
              }}
              onClose={() => setDeleteSuccessMessage("")}
            >
              {deleteSuccessMessage}
            </Alert>
          </TableCell>
        </TableRow>
      )}
      {errorMessage && (
        <TableRow>
          <TableCell colSpan={5}>
            <Alert
              severity="error"
              variant="filled"
              sx={{
                mt: 2,
                position: "fixed",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
              }}
              onClose={() => setErrorMessage("")}
            >
              {errorMessage}
            </Alert>
          </TableCell>
        </TableRow>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

Row.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired, // Sửa từ userID thành _id
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        if (response.status === 200) {
          setUsers(response.data);
        } else {
          console.error("Failed to fetch users:", response.message);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      await userApi.deleteUser(userId);
      const updatedUsers = await userApi.getAllUsers();
      setUsers(updatedUsers.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="center">Role</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <Row
              key={user._id} // Sửa từ userID thành _id
              user={user}
              onDelete={handleDelete}
              userRole={user.role}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
