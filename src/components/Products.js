import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import { useHistory, Link } from "react-router-dom";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 t


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */
let product = {
  name: "Tan Leatherette Weekender Duffle",
  category: "Fashion",
  cost: 150,
  rating: 4,
  image:
    "https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
  _id: "PmInA797xJhMIPti",
};

const debounce = (fn, delay) => {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const Products = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true); // marking loading for circular
  const [products, setProducts] = useState(product); // products list
  const [filteredProducts, setFilteredProducts] = useState(product); //filtere products after search
  const [searchText, setSearchText] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");
  const history = useHistory();

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const url = `${config.endpoint}/products`;
  const performAPICall = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setProducts(res.data);
      setFilteredProducts(res.data);
      setLoading(false);
      console.log("res::", res);
      return res.data;
    } catch (err) {
      if (err.response) {
        enqueueSnackbar(err.response?.statusText, { variant: "error" });
      } else {
        enqueueSnackbar(err.message, { variant: "error" });
      }
      setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    const searchURL = `${config.endpoint}/products/search?value=${text}`;
    console.log(text);
    try {
      let searchedProds = await axios.get(searchURL);
      console.log(searchedProds);
      setLoading(false);
      setFilteredProducts(searchedProds.data);
    } catch (err) {
      if (err.response.status === 404) {
        setFilteredProducts([]);
      }
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
    performAPICall();
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  useEffect(() => {
    if (searchText) {
      debounceSearch(searchText);
    }
  }, [searchText]);

  const debounceSearch = useRef(debounce(performSearch, 500)).current;

  // const debounceSearch = (event, debounceTimeout) => {
  //   let text=event.target.value;
  //   let timerId;
  //   if(timerId){clearTimeout(timerId)}

  //    timerId=setTimeout(()=>{
  //     performSearch(text)
  //    },debounceTimeout)
  // };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data

      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  useEffect(() => {
    const onLoadHAndler = async () => {
      const productData = await performAPICall();
      const cartData = await fetchCart(token);
      if (productData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productData);
        setItems(cartDetails);
      }
    };
    onLoadHAndler();
  }, []);

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    if (items) {
      return items.findIndex((item) => item.productId === productId) !== -1;
    }
  };

  const updateCartItems = async (cartData, products) => {
    const cartItems = generateCartItemsFrom(cartData, products);
    setItems(cartItems);
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      enqueueSnackbar("Login to add an item to the cart", {
        variant: "warning",
      });
      history.push("/login");
      return;
    }

    if (options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart,use the cart sidebar to update quantity or remove item",
        { variant: "warning" }
      );
      return;
    }

    try {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", res.data);
      updateCartItems(res.data, products);
    } catch (error) {
      if (error.response) {
        console.error(error.response);
        enqueueSnackbar(error.response.data.message, { variant: "warning" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details, Cheack if backend is runnning",
          { variant: "warning" }
        );
      }
    }
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          fullWidth
          margin="5px"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </Header>
      {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}

      {/* Search view for mobiles */}

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container spacing={3}>
        {/* hero section */}
        <Grid item className="product-grid" xs={12} md={isLoggedIn ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          <Box sx={{ margin: 3 }}>
            {loading ? (
              <div className="loadingDiv">
                <CircularProgress></CircularProgress>
                <Typography variant="h6">Loading Products...</Typography>
              </div>
            ) : (
              <Grid container sx={{}} spacing={3}>
                {filteredProducts?.length ? (
                  filteredProducts.map((product) => {
                    return (
                      <Grid
                        key={product._id}
                        mt={2}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <ProductCard
                          product={product}
                          handleAddToCart={async () => {
                            await addToCart(
                              token,
                              items,
                              products,
                              product._id,
                              1,
                              { preventDuplicate: true }
                            );
                          }}
                        />
                      </Grid>
                    );
                  })
                ) : (
                  // <div className="loadingDiv">
                  //   <span>😐</span>
                  //   <Typography variant="h6">No products found</Typography>
                  // </div>
                  <div className={"loadingDiv"}>
                    <SentimentDissatisfied />
                    <h3>No products found</h3>
                  </div>
                )}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
        {/* cart area 25 % */}
        {isLoggedIn ? (
          <Grid item sx={{}} md={3} xs={12}>
            <Cart
              products={products}
              items={items}
              handleQuantity={addToCart}
              hasCheckOutButton
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
