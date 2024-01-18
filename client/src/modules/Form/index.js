import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { USER_SIGN_IN_PATH, DEFAULT_PATH } from '../../constants/api'

const Index = (Props) => {
    // const [isSignInPage, setIsSignInPage] = useState();
    const isSignInPage = Props.isSignInPage;
    const [Data, setData] = useState({
        ...(!isSignInPage && {
            fullName: "",
            confirmPassword: ""
        }),
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const setDataLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("data", Data);

        try {
            const res = await fetch(`http://localhost:5500/api/${isSignInPage ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(Data)
            });


            if (!isSignInPage) {
                // for sign up page
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("API Error Response Data : ", errorData);

                    if (errorData.code === 'MISSING_FIELDS') {
                        toast.error('Please fill in all required fields.');
                    } else if (errorData.code === 'USER_EXISTS') {
                        toast.error('User already exists.');
                    } else {
                        toast.error('An error occurred.');
                    }

                } else {
                    const resData = await res.json();
                    console.log("API Response Data : ", resData);

                    if (resData.code === 'USER_SAVED_SUCCESS') {
                        toast.success(resData.message);
                        navigate(USER_SIGN_IN_PATH);
                    } else {
                        toast.error('An unexpected error occurred.');
                    }

                }
            } else {
                // for sign in page 
                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("API Error Response Data : ", errorData);

                    if (errorData.code === 'MISSING_FIELDS') {
                        toast.error('Please fill in all required fields.');
                    } else if (errorData.code === 'USER_NOT_FOUND') {
                        toast.error('User not found.');
                    } else if (errorData.code === 'INCORRECT_PASSWORD') {
                        toast.error('Incorrect password. Please try again.');
                    } else {
                        toast.error('An error occurred.');
                    }

                } else {
                    const resData = await res.json();
                    console.log("API Response Data : ", resData);

                    if (resData.code === 'USER_LOGIN_SUCCESS') {
                        // set token in localStorage 
                        setDataLocalStorage("user:token", `Bearer ${resData.token}`);
                        setDataLocalStorage("user:info", `${JSON.stringify(resData.user)}`);
                        
                        toast.success(`Welcome, ${resData.user.fullName}!`);
                        setTimeout(() => {
                            navigate(DEFAULT_PATH);
                        }, 2000);
                    } else {
                        toast.error('An unexpected error occurred.');
                    }
                }
            }
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                toast.error('Unable to connect to the server. Please check your internet connection or try again later.');
            } else {
                toast.error('An unexpected error occurred.');
            }
            console.log(error);
        }
    }



    return (
        <div>
            <form className='signup-form' onSubmit={(e) => handleSubmit(e)}>
                <center><h3>{!isSignInPage ? "Sign Up" : "Sign In"}</h3></center>
                {!isSignInPage ? (
                    <>
                        <div className="mb-3">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="full name"
                                onChange={(e) => { setData({ ...Data, fullName: e.target.value }) }}
                            />
                        </div>
                    </>
                ) : ""}
                <div className="mb-3">
                    <label>Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => { setData({ ...Data, email: e.target.value }) }}
                    />
                </div>
                <div className="mb-3">
                    <label>Password</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => { setData({ ...Data, password: e.target.value }) }}
                    />
                </div>
                {
                    !isSignInPage ?
                        <>
                            <div className="mb-3">
                                <label>Repeat Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Repeat password" onChange={(e) => { setData({ ...Data, confirmPassword: e.target.value }) }}
                                />
                            </div>
                        </> : ""
                }
                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        {!isSignInPage ? "Sign Up" : "Sign In"}
                    </button>
                </div>
                <p className="forgot-password text-right">
                    {!isSignInPage ? "Already registered" : "Don't have Account"}&nbsp;
                    <span
                        className='link-primary '
                        role="button"
                        onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>
                        {isSignInPage ? "Sign Up" : "Sign In"}
                    </span>
                </p>
            </form>

            <Toaster position='top-right' />
        </div>
    );
};

export default Index;
