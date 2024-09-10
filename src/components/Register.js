import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router-dom';
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData,setFormData] = useState({
    userName : "",
    password:"",
    confirmPassword:""
  });
  const [loading,setLoading] = useState(false);
 const history = useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const url = `${config.endpoint}/auth/register`;

  const register = async() => {
    setLoading(true);
    // console.log("data::",formData);
    

    if(validateInput(formData)){
    try{
        const response = await axios.post(url,{
        username: formData.userName,
        password: formData.password,

      });
      // console.log("Response::",response);
      if(response.data.success){
        enqueueSnackbar("Success .. Registered new user !",{
          variant: "success",
        });
        setLoading(false);
        history.push('/login');
        // console.log("Success !");
      }
      // console.log(response);
    }catch(error){
       if(error.status && error.response.status){
        enqueueSnackbar("Username is already taken",{
          variant: "error",
        });
       }
       else{
        enqueueSnackbar(error.response.data.message, { variant: "error" });
       }
       setLoading(false);
      //  console.log("Error::",error.response);
    }
  }
  else{
    setLoading(false);
  }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (!data.userName.length) {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      return false;
    } else if (data.userName.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (!data.password.length) {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return false;
    }
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            onChange={(e)=>{
              setFormData({...formData,userName : e.target.value});
            }}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e)=>{
              setFormData({...formData,password : e.target.value});
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e)=>{
              setFormData({...formData,confirmPassword : e.target.value});
            }}
          />
          {loading?(
              <Button variant="outlined" sx={{border:'1px solid #00a278'}}  onClick={register}>
              <CircularProgress sx={{color:'#00a278'}} />
            </Button>
          ):(
            <Button className="button" variant="contained" onClick={register}>
            Register Now
           </Button>
          )}
          
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
