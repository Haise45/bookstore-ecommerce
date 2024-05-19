import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import orderApi from "../../api/orderapi";
import userApi from "../../api/userapi";
import "../../styles/order.scss";

const OrderDetails = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const { _id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await orderApi.getOrderById(_id);
        const order = response.data;
        order.date = new Date(order.date).toLocaleDateString("en-GB");
        setOrderInfo(order);
        console.log(order);
        if (order.user_id) {
          fetchUserDetails(order.user_id);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [_id]);

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

  const handleBack = () => {
    navigate("/orders");
  };

  if (!orderInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bgcolor">
      <Box height={70} />
      <Box px={3}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          height={70}
        >
          <h1>Order Details</h1>
          <Button onClick={handleBack} variant="outlined">
            Back
          </Button>
        </Box>
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              Order Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="body1">
                  Order Number: {orderInfo._id}
                </Typography>
                <Typography variant="body1">
                  Order Date: {orderInfo.date}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  Order Status: {orderInfo.status}
                </Typography>
                <Typography variant="body1">
                  Order Payment: ${orderInfo.payment}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body1">
                  Name Customer:{" "}
                  {userDetails[orderInfo.user_id] &&
                    `${userDetails[orderInfo.user_id].firstName} ${
                      userDetails[orderInfo.user_id].lastName
                    }`}
                </Typography>
                <Typography variant="body1">
                  Customer's Email:{" "}
                  {userDetails[orderInfo.user_id] &&
                    userDetails[orderInfo.user_id].email}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              Order's Item
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Name</TableCell>
                    <TableCell align="center">Image</TableCell>
                    <TableCell align="center">Author</TableCell>
                    <TableCell align="center">Categories</TableCell>
                    <TableCell align="center">Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={orderInfo._id}>
                    <TableCell align="center">{orderInfo.bookList.name}</TableCell>
                    <TableCell align="center">
                      <img
                        src={orderInfo.bookList.bookImage}
                        alt={orderInfo.bookList.name}
                        className="book-image"
                      />
                    </TableCell>
                    <TableCell align="center">{orderInfo.bookList.author}</TableCell>
                    <TableCell align="center">
                      {orderInfo.bookList.categoriesSet &&
                        orderInfo.bookList.categoriesSet.map((category, catIndex) => (
                          <span key={catIndex}>
                            {category.name}
                            {catIndex !== orderInfo.bookList.categoriesSet.length - 1 &&
                              ", "}
                          </span>
                        ))}
                    </TableCell>
                    <TableCell align="center">${orderInfo.bookList.price}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
      <Box height={80} />
    </div>
  );
};

export default OrderDetails;
