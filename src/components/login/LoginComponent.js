import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useCustomLogin from "../../hooks/useCustomLogin";
import { signup } from "../api/memberApi";
import "./LoginStyle.css";

const LoginComponent = () => {
  const { doLogin, isLogin } = useCustomLogin();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
    address: {
      address: "",
      detailAddress: "",
      zipcode: "",
    },
  });

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            zipcode: data.zonecode,
            address: data.address,
          },
        }));
      },
    }).open();
  };

  const validateFields = () => {
    if (isSignup) {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.phone ||
        !formData.address.zipcode ||
        !formData.address.detailAddress
      ) {
        alert("Please fill in all fields.");
        return false;
      }
      if (formData.password !== formData.passwordConfirm) {
        alert("Passwords do not match.");
        return false;
      }
    } else {
      if (!formData.email || !formData.password) {
        alert("Please enter email and password.");
        return false;
      }
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format.");
      return false;
    }

    return true;
  };

  const loginHandler = async (loginData) => {
    try {
      const response = await doLogin(loginData);

      if (response?.error) {
        setError("Login failed. Please check your email and password.");
      } else {
        console.log("Login success data:", response);
        alert("Login successful!");
        localStorage.setItem("isLogin", true);
        localStorage.setItem("auth", JSON.stringify(response));
        navigate(from, { replace: true });
        window.location.reload();
      }
    } catch (err) {
      console.error("Error occurred during login:", err);
      setError(err.message || "An unknown error occurred.");
      alert(err.message || "An unknown error occurred.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    if (isSignup) {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      };

      console.log("Signup request data:", signupData);

      try {
        await signup(signupData);
        alert("Signup successful!");
        setIsSignup(false);
      } catch (err) {
        console.error("Signup error:", err);
        setError(err.message || "An error occurred during signup.");
        alert(err.message || "An error occurred during signup.");
      }
    } else {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      await loginHandler(loginData);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <div className="card-3d-wrap">
          <div className={`card-3d-wrapper ${isSignup ? "rotate" : ""}`}>
            <div className="card-front">
              <div className="center-wrap">
                <div className="button-group">
                    <div className="checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        className="checkbox" 
                        id="reg-log" 
                        name="reg-log"  
                        checked={isSignup}
                        onChange={() => setIsSignup(!isSignup)}
                      />
                      <label htmlFor="reg-log">
                        <span>LOG IN</span>
                        <span>SIGN UP</span>
                      </label>
                      <p className="toggle-text" onClick={toggleForm}>
                      Don't have an account? <span>Sign up</span>
                      </p>  
                    </div>
                  </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    className="form-style"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-style"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button className="b-button normal" onClick={handleSubmit}>
                  Log In
                </button>
                <div className="login-image-container">
                  <img 
                    src="https://static-cdn.sporki.com/news/xports/20241/1405781/c_1691161944215433.jpg" 
                    alt="Login decoration" 
                    className="login-image"
                  />
                </div>

              </div>
            </div>
            
          {/* 회원가입 */}
            <div className="card-back">
              <div className="center-wrap">
              <div className="button-group">
                <div className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      id="reg-log" 
                      name="reg-log"  
                      checked={isSignup}
                      onChange={() => setIsSignup(!isSignup)}
                    />
                    <label htmlFor="reg-log">
                      <span>LOG IN</span>
                      <span>SIGN UP</span>
                    </label>
                <p className="toggle-text" onClick={toggleForm}>
                  Already have an account? <span>Log in</span>
                </p>
                  </div>
                </div>  
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    className="form-style"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    type="email"
                    name="email"
                    className="form-style"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-style"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <input
                    type="password"
                    name="passwordConfirm"
                    className="form-style"
                    placeholder="Confirm Password"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    className="form-style"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        readOnly
                        className="normal"
                        placeholder="우편번호"
                        value={formData.address.zipcode}
                      />
                      <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="b-button normal"
                      >
                        Search Address
                      </button>
                    </div>
                    <input
                      type="text"
                      readOnly
                      className="normal"
                      placeholder="기본주소"
                      value={formData.address.address}
                    />
                    <input
                      type="text"
                      className="normal"
                      placeholder="상세주소"
                      value={formData.address.detailAddress}
                      onChange={(e) =>
                        setFormData((prevState) => ({
                          ...prevState,
                          address: {
                            ...prevState.address,
                            detailAddress: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  
                </div>
                <button className="b-button normal" onClick={handleSubmit}>
                  Sign Up
                </button>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
