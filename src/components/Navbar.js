import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IoIosFootball } from "react-icons/io";
import { BsCart4 } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";
import { FaUserTimes } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FcManager } from "react-icons/fc";
import "./Navbar.css";
import { getWishlist } from "../components/api/wishlistApi";

export default function Navbar() {
  const list = useSelector((state) => state.cart); // Get cart state
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin"));
  const [auth, setAuth] = useState(() => {
    const storedAuth = localStorage.getItem("auth");
    console.log("Stored auth:", storedAuth); // Debugging log
    try {
      return storedAuth ? JSON.parse(storedAuth) : null;
    } catch (error) {
      console.error("Failed to parse auth from localStorage:", error);
      return null;
    }
  });

  console.log("isLogin:", isLogin);
  console.log("auth:", auth);
  if (!auth) {
    console.warn("Auth is null or undefined. Check localStorage.");
  }

  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // 위시리스트 데이터 로드
    const fetchWishlist = async () => {
      if (auth?.user?.id) {
        try {
          const wishlistData = await getWishlist(auth.user.id);
          setWishlistCount(wishlistData.length);
        } catch (error) {
          console.error("위시리스트 로드 실패:", error);
          setWishlistCount(0);
        }
      }
    };
    // useEffect에 의존성배열에 auth를 넣으면 orders페이지에서 위시리스트 데이터가 로드됨 
    fetchWishlist();
  }, [auth]); // auth가 변경될 때마다 위시리스트 다시 로드

  const handleAddStore = () => {
    navigate("/admin/store/add"); // StoreAddComponent로 이동
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const loginStatus = localStorage.getItem("isLogin");
      setIsLogin(loginStatus);
      const updatedAuth = localStorage.getItem("auth");
      console.log(updatedAuth);
      setAuth(updatedAuth ? JSON.parse(updatedAuth) : null);
    };

    // Listen for localStorage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    if (value.trim()) {
      navigate(`/search/${value}`);
      setIsSearchOpen(false);
      setValue("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const adminHandleClick = () => {
    console.log("admin click");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLegout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload(); // Function call added to reload the page
  }

  return (
    <header>
      <div className="main-header">
        <div className="center-section">
          <Link to="/" className="logo">
            <img src="/images/real.png" alt="Logo" />
          </Link>
          <div className="nav-container">
            <nav className="main-nav">
              <ul>
                <li>
                  <Link to="/" className="text-orange-500 chathura-regular">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/kits" className="chathura-regular">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/ticket/list" className="chathura-regular">
                    Tickets
                  </Link>
                </li>
                <li>
                  <Link to="/videos" className="chathura-regular">
                    RM Play
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="chathura-regular">
                    News
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="chathura-regular">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/board/list/" className="chathura-regular">
                    Board
                  </Link>
                </li>
                <li>
                  <Link to="/matchschedule" className="chathura-regular">
                    Match Schedule
                  </Link>
                </li>
                <li>
                  <Link to="/league-table" className="chathura-regular">
                    League Table
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="header-actions">
              {auth && auth.user && auth.user.role === "ADMIN" && (
                <button onClick={handleAddStore}>
                  <FcManager />
                </button>
              )}
              <div
                ref={searchRef}
                className={`search-section ${isSearchOpen ? "open" : ""}`}
              >
                {isSearchOpen ? (
                  <>
                    <input
                      type="text"
                      placeholder="SEARCH A CELEB"
                      value={value}
                      onChange={handleChange}
                      onKeyPress={handleKeyPress}
                      autoFocus
                    />
                    <button onClick={handleSubmit}>
                      <BiSearch />
                    </button>
                  </>
                ) : (
                  <button
                    className="search-icon"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <BiSearch />
                    <span className="button-tooltip">Search</span>
                  </button>
                )}
              </div>
              <Link
                to={isLogin ? "/members/mypage" : "/members/login"}
                className="user-btn"
              >
                {isLogin ? <FaUserCheck /> : <FaUserTimes />}
                <span className="button-tooltip">
                  {isLogin ? "My Page" : "User"}
                </span>
              </Link>
              <Link to="/wishlist/" className="wish-btn">
                <IoIosFootball />
                <span className="button-tooltip">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="cart-count">{wishlistCount}</span>
                )}
              </Link>
              <Link to="/cart" className="cart-btn">
                <BsCart4 />
                <span className="button-tooltip">Cart</span>
                {list && <span className="cart-count">{list.length}</span>}
              </Link>
            </div>
          </div>
        </div>
        <button type="button" onClick={handleLegout}>
          loginout
        </button>
      </div>
    </header>
  );
}
