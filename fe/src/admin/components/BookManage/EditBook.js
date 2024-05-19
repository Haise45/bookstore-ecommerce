import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bookApi from "../../api/bookapi";
import categoryApi from "../../api/categoryapi";

export default function UpdateBook({ onUpdate }) {
  const { _id } = useParams();
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [googleDriveLink, setGoogleDriveLink] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [navigateBack, setNavigateBack] = useState(false);
  const navigate = useNavigate();
  const [initialBookDetails, setInitialBookDetails] = useState(null);

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
    const fetchBookDetails = async () => {
      try {
        const bookResponse = await bookApi.getById(_id);
        const bookDetails = bookResponse.data;
        console.log(bookDetails);
        setName(bookDetails.name);
        setAuthor(bookDetails.author);
        setPrice(bookDetails.price);
        setDescription(bookDetails.description);
        setSelectedCategories(bookDetails.categories.map(categories => categories._id));
        const imageData = bookDetails.image;
        if (imageData) {
          setGoogleDriveLink(imageData);
          setImagePreview(imageData);
        }
        setInitialBookDetails(bookDetails);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };
  
    fetchBookDetails();
  }, [_id]);

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
        categories: selectedCategories.map((category) => ({
          _id: category,
        })),
      };

      console.log("Sending data:", bookData);

      try {
        const response = await bookApi.updateBook(_id, bookData);
        console.log("Response:", response);
        if (typeof onUpdate === "function") {
          onUpdate(response);
        }
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      } catch (error) {
        console.error("Error updating book:", error);
        alert("Failed to update book. Please try again later.");
      }
    },
    [_id, name, author, selectedCategories, price, description, googleDriveLink, onUpdate]
  );

  const handleCancel = () => {
    if (navigateBack) {
      setNavigateBack(false);
    } else {
      if (initialBookDetails) {
        setName(initialBookDetails.name);
        setAuthor(initialBookDetails.author);
        setPrice(initialBookDetails.price);
        setDescription(initialBookDetails.description);
        if (initialBookDetails.image) {
          setGoogleDriveLink(initialBookDetails.image);
          setImagePreview(initialBookDetails.image);
        } else {
          setGoogleDriveLink("");
          setImagePreview("");
        }
      }
    }
  };

  const handleBack = () => {
    navigate(`/books/${_id}`);
  };

  const renderImage = () => {
    if (imagePreview) {
      return <img src={imagePreview} alt="Book cover" style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "8px" }} />;
    }
    return null;
  };

  const handleGoogleDriveLinkChange = (event) => {
    const link = event.target.value;
    setGoogleDriveLink(link);
    setImagePreview(link);
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
            <h1>Update Book Information</h1>
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
                          ? selectedCategories.filter(id => id !== category._id)
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
              onChange={handleGoogleDriveLinkChange}
              margin="normal"
              fullWidth
              sx={{ backgroundColor: "white", fontWeight: 550 }}
            />
            {renderImage()}
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
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
                onClick={() => setNavigateBack(true)}
              >
                Update
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
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
              Book updated successfully!
            </MuiAlert>
          )}
        </Box>
      </Box>
    </div>
  );
}
