import React, { useState, useEffect } from "react";
import liff from "@line/liff";
import axios from "axios";
import "./App.css";

function App() {  
  const [profile, setProfile] = useState(null);  
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [isEmailRegister, setIsEmailRegister] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(false);  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const API_BASE_URL = "https://7d03-140-123-57-111.ngrok-free.app";

  useEffect(() => {  
    initializeLiff(); 
  }, []);  

  const initializeLiff = async () => {  
    try {  
      console.log("正在初始化 LIFF...");
      await liff.init({ liffId: "2006664266-zXG3xyNe" });  // 確保該非同步操作完成，才會繼續執行
  
      if (liff.isLoggedIn()) { 
        console.log("用戶已登入，正在獲取資料...");
        const userProfile = await liff.getProfile();
        console.log("用戶資料:", userProfile);
        setProfile(userProfile);   // 更新 Profile 狀態
        setIsLoggedIn(true);       // 更新 登入 狀態
      } else {
        console.log("用戶未登入");
      }
    } 
    catch (err) {
      console.error("LIFF 初始化失敗:", err.message);
    }
  };
  
  const handleLineLogin = async () => {
    try {
      await liff.login();
      console.log("登入成功，正在獲取資料...");
      const userProfile = await liff.getProfile();
      console.log("用戶資料獲取成功:", userProfile);
  
      // 更新狀態
      setProfile(userProfile);
      setIsLoggedIn(true);
  
      await sendUserDataToBackend(userProfile);
    } catch (error) {
      console.error("登入失敗:", error.message);
      alert("註冊中");
    }
  };
  

  const sendUserDataToBackend = async (userProfile) => {
    try {
      const accessToken = liff.getAccessToken();
      const userData = {
        userId: userProfile.userId,
        name: userProfile.displayName,
        pictureUrl: userProfile.pictureUrl,
        loginType: "LINE",
      };
  
      console.log("傳送用戶資料到後端:", userData);
  
      const response = await axios.post(`${API_BASE_URL}/api/save_user`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (response.status === 200 || response.status === 201) {
        console.log("用戶資料成功儲存:", response.data);
        alert("資料儲存成功！");
      } else {
        alert('資料儲存失敗')
      }

    } catch (error) {
      console.error("儲存用戶資料失敗:", error.message);
      alert("儲存資料失敗，請稍後再試");
    }
  };
  
  // 用 e 來捕捉 onSubmit 事件
  const handleEmailRegister = async (e) => {
    e.preventDefault();  // 防止表單提交後刷新頁面
    if (email && password) {
      try {
        const userData = {
          email,
          password,
          loginType: "EMAIL"
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/save_user`,
          userData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 201) {
          alert("註冊成功！");
          setIsEmailRegister(false);
        } else if (response.status === 200 && response.data.message === "用戶已存在") {
          alert("此 Email 已經註冊過了！");
        }
      } catch (err) {
        console.error("註冊失敗", err);
        const errorMessage = err.response?.data?.error || "註冊失敗，請稍後再試！";
        alert(errorMessage);
      }
    } else {
      alert("請輸入有效的 Email 和密碼！");
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      try {
        const userData = {
          email,
          password,
          loginType: "EMAIL"
        };

        const response = await axios.post(
          `${API_BASE_URL}/api/login`,
          userData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          alert("登入成功！");
          setIsEmailLogin(false);
          window.location.href = "https://yifunlin.github.io/stock/stock_report.html";
        }
      } catch (err) {
        console.error("登入失敗", err);
        const errorMessage = err.response?.data?.error || "登入失敗，請確認您的帳號密碼！";
        alert(errorMessage);
      }
    } else {
      alert("請輸入有效的 Email 和密碼！");
    }
  };

  // 回傳 JSX 結構
  return (
    <div className="login-container">
        {/* Logo 區*/}
      <div className="logo">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="2" />
          <path d="M20,50 L40,30 L60,70 L80,20" stroke="#4CAF50" strokeWidth="3" fill="none" />
        </svg>
        <h1>股票推薦系統</h1>
        <p>請選擇登入方式</p>
      </div>
      {/* 動態渲染區域: 使用三元運算判斷 */}
      {isLoggedIn && profile ? (     
      // 若用戶已登入&有用戶資料時，執行: 顯示用戶照片、名稱、用戶 ID、提供兩個按鈕(登出、進入)
        <div className="profile-box">
          <img src={profile.pictureUrl} alt="Profile" className="profile-picture" />
          <h2>{profile.displayName}</h2>
          <p>用戶 ID: {profile.userId}</p>

          <button className="btn btn-login" onClick={() => {
              liff.logout();
              setIsLoggedIn(false);
              setProfile(null);
            }} >登出</button>

          <button className="btn btn-enter" onClick={() => {
              window.location.href = "https://yifunlin.github.io/stock/stock_report.html";
            }} >進入</button>
        </div>

      // 如果 isLoggedIn && profile 為 false，則改判斷 isEmailRegister  
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
            <button type="submit" className="btn btn-register">註冊</button>
          </form>
          <button className="btn" onClick={() => setIsEmailRegister(false)}>返回</button>
        </div>

      // 如果 isEmailRegister 為 false，繼續判斷 isEmailLogin 是否為 True
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
            <button type="submit" className="btn btn-login">登入</button>
          </form>
          <button className="btn" onClick={() => setIsEmailLogin(false)} >返回</button>
        </div>
      // 若上述條件都不成立，渲染主畫面（Email 登入、註冊、LINE 登入 )
      ) : (
        <div className="login-box">
          <div className="button-row">

            {/*根據用戶操作切換到不同模式*/}
            <button className="btn btn-login" onClick={() => setIsEmailLogin(true)}>登入</button>
            <button className="btn btn-register" onClick={() => setIsEmailRegister(true)}>註冊</button>
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
              </svg>Line 登入</button>
        </div>
      )}
    </div>
  );
}

export default App;