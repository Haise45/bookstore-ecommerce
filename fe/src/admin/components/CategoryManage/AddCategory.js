import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import categoryApi from "../../api/categoryapi";

const AddCategory = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (event) => {
    const capitalizedValue = capitalizeFirstLetter(event.target.value);
    setCategoryName(capitalizedValue);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleAddCategory = async () => {
    if (categoryName.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }

    try {
      const response = await categoryApi.getAllCategories();
      const existingCategories = response.data;
      if (existingCategories.some((category) => category.name === categoryName)) {
        setError("Category already exists.");
        return;
      }

      await categoryApi.createCategory({ name: categoryName });
      setSuccessMessage("Category added successfully: " + categoryName);
      setCategoryName("");
      setError("");
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Error adding category. Please try again.");
    }
  };

  return (
    <Box mt={2} p={2} component={Paper} elevation={3} className="category-container">
      <Box display="flex" alignItems="center">
        <TextField
          label="Category Name"
          variant="outlined"
          value={categoryName}
          onChange={handleInputChange}
          error={Boolean(error)}
          helperText={error}
          style={{ marginRight: "16px", flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Add Category  
        </Button>
      </Box>
      {successMessage && (
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
          sx={{
            mt: 2,
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          {successMessage}
        </Alert>
      )}
    </Box>
  );
};

export default AddCategory;
