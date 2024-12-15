import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
import "./App.css";

function App() {
  const [profile, setProfile] = useState(null); // Line 使用者資料
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Line 登入狀態
  const [isEmailRegister, setIsEmailRegister] = useState(false); // 是否選擇 Email 註冊
  const [isEmailLogin, setIsEmailLogin] = useState(false); // 是否選擇 Email 登入
  const [email, setEmail] = useState(""); // Email
  const [password, setPassword] = useState(""); // Password

  const LIFF_URL = "https://liff.line.me/2006664266-zXG3xyNe";

  useEffect(() => {
    liff
      .init({ liffId: "2006664266-zXG3xyNe" })
      .then(() => {
        console.log("LIFF 初始化成功");
      })
      .catch((err) => console.error("LIFF 初始化失敗", err));
  }, []);

  const handleLineLogin = async () => {
    try {
      if (!liff.isLoggedIn()) {
        await liff.login();
      }
      const profile = await liff.getProfile();
      setProfile(profile);
      setIsLoggedIn(true);

      const userData = {
        name: profile.displayName,
        userId: profile.userId,
        pictureUrl: profile.pictureUrl,
        loginType: "LINE",
      };
      await axios.post("https://3a76-2401-e180-8c60-2501-7cae-12fa-2f97-a32e.ngrok-free.app/api/save_user", userData);
      alert("Line 使用者資料已儲存！");
      // 若登入後也需要直接導向 LIFF 頁面，可在此加入
      // window.location.href = LIFF_URL;
    } catch (err) {
      console.error("Line 登入失敗", err);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const userData = { email, password, loginType: "EMAIL" };
        await axios.post("https://3a76-2401-e180-8c60-2501-7cae-12fa-2f97-a32e.ngrok-free.app/api/save_user", userData);
        alert("註冊成功！");
        setIsEmailRegister(false);
      } catch (err) {
        console.error("註冊失敗", err);
        alert("註冊失敗，請稍後再試！");
      }
    } else {
      alert("請輸入有效的 Email 和密碼！");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const userData = { email, password, loginType: "EMAIL" };
        const response = await axios.post("https://3a76-2401-e180-8c60-2501-7cae-12fa-2f97-a32e.ngrok-free.app/api/login", userData);
        if (response.status === 200) {
          alert("登入成功！");
          setIsEmailLogin(false);
          // 登入成功後導回 LIFF 頁面
          window.location.href = LIFF_URL;
        }
      } catch (err) {
        console.error("登入失敗", err);
        alert("登入失敗，請確認您的帳號密碼！");
      }
    } else {
      alert("請輸入有效的 Email 和密碼！");
    }
  };

  return (
    <div className="login-container">
      <div className="logo">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
          <path d="M20,50 L40,30 L60,70 L80,20" stroke="#4CAF50" strokeWidth="3" fill="none" />
        </svg>
        <h1>股票推薦系統</h1>
        <p>請選擇登入方式</p>
      </div>
      {isLoggedIn && profile ? (
        <div className="profile-box">
          <img
            src={profile.pictureUrl}
            alt="Profile"
            className="profile-picture"
          />
          <h2>{profile.displayName}</h2>
          <p>用戶 ID: {profile.userId}</p>
          <button
            className="btn btn-login"
            onClick={() => {
              liff.logout();
              setIsLoggedIn(false);
              setProfile(null);
            }}
          >
            登出
          </button>
        </div>
      ) : isEmailRegister ? (
        <div className="email-register-box">
          <h1>Email 註冊</h1>
          <form onSubmit={handleEmailRegister}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入您的 Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密碼</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入您的密碼"
                required
              />
            </div>
            <button type="submit" className="btn btn-register">
              註冊
            </button>
          </form>
          <button
            className="btn"
            onClick={() => setIsEmailRegister(false)}
          >
            返回
          </button>
        </div>
      ) : isEmailLogin ? (
        <div className="email-login-box">
          <h1>Email 登入</h1>
          <form onSubmit={handleEmailLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入您的 Email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密碼</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入您的密碼"
                required
              />
            </div>
            <button type="submit" className="btn btn-login">
              登入
            </button>
          </form>
          <button
            className="btn"
            onClick={() => setIsEmailLogin(false)}
          >
            返回
          </button>
        </div>
      ) : (
        <div className="login-box">
          <div className="button-row">
            <button
              className="btn btn-login"
              onClick={() => setIsEmailLogin(true)}
            >
              登入
            </button>
            <button
              className="btn btn-register"
              onClick={() => setIsEmailRegister(true)}
            >
              註冊
            </button>
          </div>
          <button className="btn btn-line btn-long" onClick={handleLineLogin}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#ffffff"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            Line 登入
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
