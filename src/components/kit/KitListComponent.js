import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const KitListComponent = () => {
  const [kits, setKits] = useState([]); // List of kits
  const [selectedKits, setSelectedKits] = useState([]); // Selected kits
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    address: "",
  }); // Recipient details

  // Get memberId from localStorage
  const memberId = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).id
    : null;

  // Fetch kits and member info on component mount
  useEffect(() => {
    const fetchKitsAndMemberInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/kits/list/${memberId}`
        );
        setKits(response.data.kits); // Set kits from API response
        setFormData({
          recipientName: response.data.member.name,
          phone: response.data.member.phone,
          address: response.data.member.address,
        }); // Set member details from API response
      } catch (error) {
        console.error("Error fetching kits and member info:", error);
      }
    };

    fetchKitsAndMemberInfo();
  }, [memberId]);

  // Handle selecting or removing a kit
  const handleSelectKit = (kit) => {
    setSelectedKits((prevSelectedKits) => {
      if (prevSelectedKits.find((selected) => selected.kit.id === kit.kit.id)) {
        return prevSelectedKits.filter(
          (selected) => selected.kit.id !== kit.kit.id
        );
      } else {
        return [...prevSelectedKits, kit];
      }
    });
  };

  // Handle input changes for recipient details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle purchase action
  const handlePurchase = async () => {
    if (!formData.recipientName || !formData.phone || !formData.address) {
      alert("Please fill in all recipient details.");
      return;
    }

    const purchaseData = {
      memberId, // Use the logged-in user's member ID
      orderItems: selectedKits.map((kit) => ({
        kit: { id: kit.kit.id },
      })), // Map selected kits to order items
      ...formData, // Include recipient details
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/order/purchase",
        purchaseData
      );
      alert("Purchase successful!");
      console.log(response);
      navigate("/order/list"); // Navigate to order list page
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("Purchase failed.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Available Kits
      </Typography>
      <Grid container spacing={3}>
        {kits.map((kit) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={kit.kit.id}>
            <Card
              style={{
                border: selectedKits.find(
                  (selected) => selected.kit.id === kit.kit.id
                )
                  ? "2px solid green"
                  : "1px solid #ccc",
              }}
            >
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:8080${kit.images[0].url}`} // Use the first image URL
                alt={kit.kit.name}
              />
              <CardContent>
                <Typography variant="h6">{kit.kit.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {kit.kit.description}
                </Typography>
                <Typography variant="body1" color="text.primary">
                  Price: ${kit.kit.price}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Stock: {kit.kit.stock}
                </Typography>
                <Button
                  variant={
                    selectedKits.find(
                      (selected) => selected.kit.id === kit.kit.id
                    )
                      ? "contained"
                      : "outlined"
                  }
                  color="primary"
                  onClick={() => handleSelectKit(kit)}
                  style={{ marginTop: "10px" }}
                >
                  {selectedKits.find(
                    (selected) => selected.kit.id === kit.kit.id
                  )
                    ? "Remove from Order"
                    : "Add to Order"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ marginTop: "30px" }}>
        <Typography variant="h5">Recipient Details</Typography>
        <div style={{ margin: "10px 0" }}>
          <TextField
            fullWidth
            label="Recipient Name"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ margin: "10px 0" }}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div style={{ margin: "10px 0" }}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePurchase}
          disabled={selectedKits.length === 0}
          style={{ marginTop: "20px" }}
        >
          Complete Purchase
        </Button>
      </div>
    </div>
  );
};

export default KitListComponent;
