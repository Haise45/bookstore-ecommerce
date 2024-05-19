import React from "react";
import Box from "@mui/material/Box";
import BookList from "../components/BookManage/BookList";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

export default function BookPage() {
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate("/add-book");
  };
  return (
    <div className="bgcolor">
      <div className="page-wrapper">
        <Box height={85} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1 style={{ marginLeft: "25px" }}>Books List</h1>
          <IconButton
            sx={{color:'#26a69a', display: { xs: "block", sm: "none" }}}
            aria-label="add book"
            onClick={handleAddBook}
          >
            <AddIcon />
          </IconButton>
          <Button
            variant="contained"
            sx={{
              color: '#ffffff',
              backgroundColor: '#26a69a',
              '&:hover': {
                backgroundColor: '#00897b',
              },
              display: { xs: "none", sm: "block" }
            }}
            onClick={handleAddBook}
          >
            Add Book
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <BookList />
          </Box>
        </Box>
      </div>
    </div>
  );
}
