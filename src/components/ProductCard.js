import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  


  return (
    <Card className="card">
      <CardActionArea>
       <CardMedia
        component="img"
        alt={product.name}
        height="140"
        image={product.image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom >
         ${product.cost}
      
        </Typography>
        <Rating
            name="read-only"
            value={product.rating}
            readOnly
          />
      </CardContent>
      </CardActionArea>
      <CardActions>
      <Button variant="contained" fullWidth onClick={handleAddToCart}>
      <AddShoppingCartOutlined />
        ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
