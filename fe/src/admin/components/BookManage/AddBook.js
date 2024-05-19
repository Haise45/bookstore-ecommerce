import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import bookApi from "../../api/bookapi";
import categoryApi from "../../api/categoryapi";

export default function AddBook({ onAdd }) {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [imageSrc, setImageSrc] = useState(""); // State để lưu đường dẫn ảnh

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (googleDriveLink) {
      setImageSrc(googleDriveLink);
    } else {
      setImageSrc("");
    }
  }, [googleDriveLink]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!name || !author || !price || !description || !googleDriveLink) {
        setError("Please fill in all fields.");
        return;
      }

      const bookData = {
        name,
        author,
        price,
        description,
        image: googleDriveLink,
        categories: selectedCategories.map((category) => ({ _id: category })),
      };

      try {
        const response = await bookApi.addBook(bookData);
        if (typeof onAdd === "function") {
          onAdd(response);
        }
        clearFields();
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } catch (error) {
        console.error("Error adding book:", error);
        alert("Failed to add book. Please try again later.");
      }
    },
    [name, author, selectedCategories, price, description, googleDriveLink, onAdd]
  );

  const clearFields = () => {
    setName("");
    setAuthor("");
    setSelectedCategories([]);
    setPrice("");
    setDescription("");
    setGoogleDriveLink("");
    setError("");
    setImageSrc("");
  };

  const handleBack = () => {
    navigate("/books");
  };

  return (
    <div className="bgcolor">
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box height={50} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            height={70}
          >
            <h1>Add New Book</h1>
            <Button onClick={handleBack} variant="outlined">
              Back
            </Button>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            <TextField
              label="Author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            <Typography variant="h7" gutterBottom sx={{ marginLeft: "10px" }}>
              Categories
            </Typography>
            <Paper elevation={3} sx={{ p: 1, marginLeft: "2px" }}>
              {categories.map((category) => (
                <FormControlLabel
                  key={category._id}
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => {
                        const updatedCategories = selectedCategories.includes(category._id)
                          ? selectedCategories.filter((id) => id !== category._id)
                          : [...selectedCategories, category._id];
                        setSelectedCategories(updatedCategories);
                      }}
                      color="primary"
                    />
                  }
                  label={category.name}
                />
              ))}
            </Paper>
            <TextField
              label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            <TextField
              label="Description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              margin="normal"
              fullWidth
              multiline
              rows={4}
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            <TextField
              label="Link Image"
              value={googleDriveLink}
              onChange={(event) => setGoogleDriveLink(event.target.value)}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            {/* Hiển thị ảnh từ link */}
            {imageSrc && (
              <img src={imageSrc} alt="Book" style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "8px" }}/>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                // disabled={!name || !author || !price || !description || !googleDriveLink}
              >
                Add
              </Button>
              <Button
                type="button"
                onClick={clearFields}
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </form>
          {showAlert && (
            <MuiAlert
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
              Book added successfully!
            </MuiAlert>
          )}
        </Box>
      </Box>
    </div>
  );
}
