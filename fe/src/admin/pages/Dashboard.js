import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import orderApi from "../api/orderapi";
import Chart from "chart.js/auto";
import Team from "../components/common/Team";
import "../styles/dash.scss";

export default function Dashboard() {
  const [orderCount, setOrderCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [animatedOrderCount, setAnimatedOrderCount] = useState(0);
  const [animatedTotalAmount, setAnimatedTotalAmount] = useState(0);
  const [animatedDeliveredCount, setAnimatedDeliveredCount] = useState(0);
  const [animatedCancelledCount, setAnimatedCancelledCount] = useState(0);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    async function fetchOrderData() {
      try {
        const orders = await orderApi.getAllOrders();
        const validOrders = orders.data.filter(
          (order) => order.status !== "CANCELLED"
        );
        setOrderCount(orders.data.length);
        setTotalAmount(calculateTotalAmount(validOrders));
        const deliveredOrders = orders.data.filter(
          (order) => order.status === "DELIVERED"
        );
        const cancelledOrders = orders.data.filter(
          (order) => order.status === "CANCELLED"
        );
        const deliveredCount = deliveredOrders.length;
        const cancelledCount = cancelledOrders.length;
        animateNumbers(
          orders.data.length,
          calculateTotalAmount(validOrders),
          deliveredCount,
          cancelledCount
        );
        drawRevenueChart(validOrders);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    }

    if (!animationCompleted) {
      fetchOrderData();
    }
  }, [animationCompleted]);

  function calculateTotalAmount(orders) {
    let total = 0;
    orders.forEach((order) => {
      total += order.payment;
    });
    return total;
  }

  function animateNumbers(
    orderCount,
    totalAmount,
    deliveredCount,
    cancelledCount
  ) {
    const incrementOrder = Math.ceil(orderCount / 50);
    const incrementAmount = Math.ceil(totalAmount / 50);
    const incrementDelivered = Math.ceil(deliveredCount / 50);
    const incrementCancelled = Math.ceil(cancelledCount / 50);

    let currentOrder = 0;
    let currentAmount = 0;
    let currentDelivered = 0;
    let currentCancelled = 0;

    const intervalId = setInterval(() => {
      currentOrder += incrementOrder;
      currentAmount += incrementAmount;
      currentDelivered += incrementDelivered;
      currentCancelled += incrementCancelled;

      if (currentOrder >= orderCount) {
        currentOrder = orderCount;
      }

      if (currentAmount >= totalAmount) {
        currentAmount = totalAmount;
      }

      if (currentDelivered >= deliveredCount) {
        currentDelivered = deliveredCount;
      }

      if (currentCancelled >= cancelledCount) {
        currentCancelled = cancelledCount;
      }

      setAnimatedOrderCount(currentOrder);
      setAnimatedTotalAmount(currentAmount);
      setAnimatedDeliveredCount(currentDelivered);
      setAnimatedCancelledCount(currentCancelled);

      if (
        currentOrder === orderCount &&
        currentAmount === totalAmount &&
        currentDelivered === deliveredCount &&
        currentCancelled === cancelledCount
      ) {
        clearInterval(intervalId);
        setAnimationCompleted(true);
      }
    }, 10);
  }

  function formatTotalAmount(amount) {
    if (amount < 1000) {
      return amount.toFixed(2);
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
  }

  function formatOrderDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function drawRevenueChart(data) {
    const canvas = document.getElementById("revenueChart");
    const ctx = canvas.getContext("2d");
    if (Chart.getChart(ctx)) {
      Chart.getChart(ctx).destroy();
    }
    const dailyRevenue = {};

    data.forEach((order) => {
      const formattedDate = formatOrderDate(order.date);
      if (dailyRevenue[formattedDate]) {
        dailyRevenue[formattedDate] += order.payment;
      } else {
        dailyRevenue[formattedDate] = order.payment;
      }
    });

    const labels = Object.keys(dailyRevenue);
    const amounts = Object.values(dailyRevenue);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Revenue",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            data: amounts,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  return (
    <div className="bgcolor">
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Stack spacing={2} direction="row">
                <Card
                  sx={{ minWidth: 49 + "%", height: 150 }}
                  className="gradient"
                >
                  <CardContent>
                    <div className="iconstyles">
                      <CreditCardIcon />
                    </div>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{ color: "#fff" }}
                    >
                      ${formatTotalAmount(animatedTotalAmount)}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body5"
                      component="div"
                      sx={{ color: "#ccd1d1" }}
                    >
                      Total revenue achieved
                    </Typography>
                  </CardContent>
                </Card>

                <Card
                  sx={{ minWidth: 49 + "%", height: 150 }}
                  className="gradientlight"
                >
                  <CardContent>
                    <div className="iconstyles">
                      <ShoppingBagIcon />
                    </div>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{ color: "#fff" }}
                    >
                      {animatedOrderCount}
                    </Typography>
                    <Typography
                      gutterBottom
                      variant="body5"
                      component="div"
                      sx={{ color: "#ccd1d1" }}
                    >
                      Total order quantity
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Stack spacing={2}>
                <Card className="gradientlight" sx={{ height: 100 + "%" }}>
                  <Stack spacing={2} direction="row">
                    <div
                      className="iconstyles"
                      style={{ marginLeft: "10px", marginTop: "20px" }}
                    >
                      <CheckCircleIcon />
                    </div>
                    <div className="paddingall">
                      <span className="pricetitle">
                        {animatedDeliveredCount}
                      </span>
                      <br />
                      <span className="pricesubtitle">
                        Order delivered successfully
                      </span>
                    </div>
                  </Stack>
                </Card>

                <Card sx={{ height: 100 + "%" }}>
                  <Stack spacing={2} direction="row">
                    <div
                      className="iconstylesblack"
                      style={{ marginLeft: "10px", marginTop: "20px" }}
                    >
                      <CancelIcon />
                    </div>
                    <div className="paddingall">
                      <span className="pricetitle">
                        {animatedCancelledCount}
                      </span>
                      <br />
                      <span className="pricesubtitle">
                        Order was cancelled
                      </span>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>

          <Box height={30} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <div
                    className="chart-container"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <canvas id="revenueChart"></canvas>
                  </div>
                  <Typography
                    variant="body1"
                    color="black"
                    align="center"
                    style={{ marginTop: "10px" }}
                  >
                    REVENUE STATISTICS CHART BY DAY
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card sx={{ height: 100 + "%" }}>
                <CardContent>
                  <div className="paddingall">
                    <span className="pricetitle">
                      Members of team 
                    </span>
                  </div>
                  <Team />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
