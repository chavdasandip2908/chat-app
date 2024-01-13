import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const Index = (Props) => {
    // const [isSignInPage, setIsSignInPage] = useState();
    const isSignInPage = Props.isSignInPage;
    const [Data, setData] = useState({
        ...(!isSignInPage && {
            firstName: "",
            lastName: "",
            confirmPassword: ""
        }),
        email: "",
        password: "",
    });
    const navigate = useNavigate();


    return (
        <div>
            <form className='signup-form'>
                <center><h3>{!isSignInPage ? "Sign Up" : "Sign In"}</h3></center>
                {!isSignInPage ? (
                    <>
                        <div className="mb-3">
                            <label>First name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First name"
                                onChange={(e) => { setData({ ...Data, firstName: e.target.value }) }}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Last name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last name"
                                onChange={(e) => { setData({ ...Data, lastName: e.target.value }) }}
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
        </div>
    );
};

export default Index;
