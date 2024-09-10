import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Typography } from "@mui/material";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import {Link} from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {

  const username = localStorage.getItem("username");
  
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {children}
        {hasHiddenAuthButtons?(
             <Link to="/">
              <Button
                  className="explore-button"
                  startIcon={<ArrowBackIcon />}
                  variant="text"
                >
                  Back to explore
                </Button>
             </Link>
        ): username?.length>0 ? ( 
        <Stack
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        >
          
      <Avatar src="avatar.png" alt={username}></Avatar>
      <Typography>{username}</Typography>
      <Link to="/register">
      <Button className="logOutButton" variant="outlined" onClick={()=> 
      {
        localStorage.clear();
      
      }
      }>
       LOGOUT         
       </Button>
      </Link>
     
        </Stack>
        ):(
          <Stack direction="row" spacing={2}>
         <Link to="/login">
             <Button variant="outlined">
            Login
          </Button>
          </Link>
    
         <Link to="/register">
             <Button variant="contained">
            Register
          </Button>
             </Link>
        
        </Stack>
        )}
      </Box>
    );
};

export default Header;
