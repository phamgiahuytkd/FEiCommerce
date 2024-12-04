
import React, { useState } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); 
    const [full_name, setFullName] = useState(""); 
    const navigate = useNavigate();
    

    const handleLogin = (event) => {
        event.preventDefault();
        localStorage.removeItem("token");

        
        api.post("/auth/login", { email, password })
          .then(response => {
            localStorage.setItem("token", response.data.result.token); // Lưu token vào localStorage  
            alert("Đăng nhập thành công!");
            window.location.href = "/";
          })
          .catch(error => {
            alert(error.response.data.message);
          });
    };



    const handleSignUp = (event) => {
        event.preventDefault();
        api.post("/users", { email, password, full_name })
        .then((response) => {
            alert("Đăng ký thành công!");
            navigate("/auth/login");
        }).catch((error) => {
            alert(error.response.data.message);
        });
    };

    return (
        <div className="signup-login-container">
        <div className="signup-login">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
                <form onSubmit={handleSignUp}>
                    <label htmlFor="chk" aria-hidden="true">Sign up</label>
                    <input type="text" name="txt" placeholder="User name" required 
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    />
                    <input type="email" name="email" placeholder="Email" required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="password" name="pswd" placeholder="PassWord" required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
            <div className="login">
                <form onSubmit={handleLogin}>
                    <label htmlFor="chk" aria-hidden="true">Login</label>
                    <input type="email" name="email" placeholder="Email" required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="password" name="pswd" placeholder="PassWord" required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
        </div>
    );
}

export default Login;
