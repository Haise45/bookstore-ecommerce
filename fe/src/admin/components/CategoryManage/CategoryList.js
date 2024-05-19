import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import categoryApi from "../../api/categoryapi";
import AddCategory from "../../components/CategoryManage/AddCategory";
import "../../styles/cate.scss";

const columns = [
  { id: "name", label: "Category Name", minWidth: 170 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
];

const CategoryList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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

  const handleDeleteCategory = async (categoryId) => {
    try {
      const categoryToDelete = categories.find(
        (category) => category._id === categoryId
      );
      if (!categoryToDelete) {
        console.error("Category not found");
        return;
      }
      const categoryName = categoryToDelete.name;
      await categoryApi.deleteCategory(categoryId);
      setDeleteDialogOpen(false);
      setSelectedCategoryId(null);
      fetchData();
      setDeleteSuccessMessage(
        `Category name "${categoryName}" deleted successfully`
      );
      setTimeout(() => {
        setDeleteSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedCategoryId(null);
  };

  const handleDeleteDialogOpen = (categoryId) => {
    setDeleteDialogOpen(true);
    setSelectedCategoryId(categoryId);
  };

  const filteredCategories =
    categories &&
    categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Box>
      <AddCategory onCategoryAdded={fetchData} />
      <Box height={20} />
      <Paper className="category-container">
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <TableContainer className="category-table">
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
              {filteredCategories &&
                filteredCategories
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((category, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          style={{ marginLeft: "8px" }}
                          onClick={() => handleDeleteDialogOpen(category._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={(filteredCategories && filteredCategories.length) || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Category"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteCategory(selectedCategoryId)}
            color="error"
            autoFocus
          >
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
    </Box>
  );
};

export default CategoryList;
