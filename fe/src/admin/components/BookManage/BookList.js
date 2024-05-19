import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bookApi from "../../api/bookapi";
import "../../styles/book.scss";

const columns = [
  { id: "name", label: "Name", minWidth: 150 },
  { id: "bookImage", label: "Image", minWidth: 100 },
  { id: "author", label: "Author", minWidth: 100 },
  { id: "categories", label: "Categories", minWidth: 100, align: "center" },
  { id: "price", label: "Price", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 200, align: "center" },
];

export default function BookList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await bookApi.getAll();
        const book = response.data
        console.log(response.data);
        setBooks(book);
        const allCategories = Array.from(
          new Set(response.data.flatMap((book) => book.categories.map((category) => category.name)))
        );
        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleViewButtonClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleDeleteButtonClick = (bookId) => {
    setSelectedBookId(bookId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const bookToDelete = books.find((book) => book._id === selectedBookId);
      if (!bookToDelete) {
        console.error("Book not found");
        return;
      }
      const bookName = bookToDelete.name;
      await bookApi.deleteBook(selectedBookId);
      setBooks(books.filter((book) => book._id !== selectedBookId));
      setDeleteSuccessMessage(`Book "${bookName}" deleted successfully`);
      setDeleteDialogOpen(false);
      setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === "" || book.categories.some((category) => category.name === selectedCategory))
  );

  return (
    <Paper className="book-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          displayEmpty
          className="category-select"
          variant="outlined"
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </div>
      <TableContainer className="book-table">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((book, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    const value = book[column.id];
                    if (column.id === "bookImage") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <img
                            // src={`data:image/jpeg;base64,${value}`}
                            src = {book.image}
                            alt="Book cover"
                            className="book-image"
                          />
                        </TableCell>
                      );
                    } else if (column.id === "categories") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Typography variant="body2">
                            {book.categories.map((categories) => categories.name).join(", ")}
                          </Typography>
                        </TableCell>
                      );
                    } else if (column.id === "price") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {`$${value}`}
                        </TableCell>
                      );
                    } else if (column.id === "actions") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewButtonClick(book._id)}
                            style={{ marginRight: "8px" }}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteButtonClick(book._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {decodeURIComponent(value)}
                        </TableCell>
                      );
                    }
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={filteredBooks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Book"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this book?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {deleteSuccessMessage && (
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
        >
          {deleteSuccessMessage}
        </Alert>
      )}
    </Paper>
  );
}
