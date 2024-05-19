import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import orderApi from "../../api/orderapi";
import userApi from "../../api/userapi";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function OrderList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await orderApi.getAllOrders();
        console.log("Response from getAllOrders:", response.data);
        const formattedOrders = response.data.map((order) => ({
          ...order,
          date: new Date(order.date).toLocaleDateString("en-GB"),
        }));
        setOrders(formattedOrders);
        const statusObj = {};
        formattedOrders.forEach((order) => {
          statusObj[order._id] = order.status;
          if (order.user_id) {
            fetchUserDetails(order.user_id);
          }
        });
        setOrderStatuses(statusObj);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await userApi.findUserById(userId);
      const userDetailsResponse = response.data;
      setUserDetails((prevState) => ({
        ...prevState,
        [userId]: userDetailsResponse,
      }));
      console.log("User details:", userDetailsResponse);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const handleUpdateOrder = async (orderId) => {
    try {
      const status = orderStatuses[orderId];
      await orderApi.updateOrderStatus(orderId, status);
      setShowAlert(true);
      setAlertMessage(`Order ${orderId} has been successfully updated to ${status}`);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      console.log("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleStatusChange = (event, orderId) => {
    setOrderStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: event.target.value,
    }));
    console.log(
      "Status changed to:",
      event.target.value,
      "for order:",
      orderId
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          <TableRow>
            <TableCell align="center">ID</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="center">Payment</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
          {(rowsPerPage > 0
            ? orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : orders
          ).map((order) => (
            <TableRow key={order._id}>
              <TableCell component="th" scope="row" align="center">
                {order._id}
              </TableCell>
              <TableCell align="center">{order.date}</TableCell>
              <TableCell align="center">${order.payment}</TableCell>
              <TableCell align="center">
                {userDetails[order.user_id] && userDetails[order.user_id].email}
              </TableCell>
              <TableCell align="center">
                <Select
                  size="small"
                  value={orderStatuses[order._id]}
                  onChange={(event) => handleStatusChange(event, order._id)}
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="PROCESSING">Processing</MenuItem>
                  <MenuItem value="DELIVERED">Delivered</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                </Select>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewOrder(order._id)}
                >
                  View
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleUpdateOrder(order._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={6}
              count={orders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
      {showAlert && (
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setShowAlert(false)}
          sx={{
            mt: 2,
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </TableContainer>
  );
}
