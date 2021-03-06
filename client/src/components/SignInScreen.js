import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_PSW = gql`
query user($email: String) {
    user(email: $email) {
        password
    }
}
`;

const UPDATE_SIGNEDIN = gql`
    mutation updateSignedIn($email: String!, $signedIn: Boolean!) {
        updateSignedIn(email: $email, signedIn: $signedIn) {
            email
            signedIn
        }
    }
`;

const bcrypt = require('bcrypt-nodejs');

class SignInScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    render() {
        if (localStorage.getItem('signedInUser'))
            this.props.history.push("/");
        let email, password;
        return (
            <Mutation mutation={UPDATE_SIGNEDIN}>
                {(updateSignedIn, { loading, error, data }) => {
                    if (data) {
                        localStorage.setItem('signedInUser', this.state.email);
                        this.props.history.push({
                            pathname: '/',
                            state: { screenName: "SignInScreen" }
                        });
                    }

                    return (
                        <Query fetchPolicy="no-cache" query={GET_PSW} variables={{ email: this.state.email }}>
                            {({ loading, error, data }) => {
                                if (data && data.user) {
                                    bcrypt.compare(this.state.password, data.user.password, async (error, result) => {
                                        if (error) return;
                                        if (result) {
                                            updateSignedIn({
                                                variables: {
                                                    email: this.state.email,
                                                    signedIn: true
                                                }
                                            });
                                        }
                                    })
                                }

                                return (

                                    <div className="container" id="user_enter_container">

                                        <div className="container row">
                                            <div className="col s4">
                                                <h3 id="recent_work_heading">Sign In</h3>
                                                <div id="sign_in">
                                                    <form onSubmit={e => {
                                                        e.preventDefault();
                                                        this.setState({ email: email.value, password: password.value })
                                                    }}>
                                                        <div class="form-group">
                                                            <label for="exampleInputEmail1">Email address</label>
                                                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required
                                                                ref={node => { email = node; }} />
                                                            {this.state.email !== "" && !loading && !error && !data.user ? <p style={{ color: "red" }}>{this.state.email + " is not a user"}</p> : ""}
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="exampleInputPassword1">Password</label>
                                                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required
                                                                ref={node => { password = node; }} />
                                                            {this.state.email !== "" && !loading && !error && data.user ? <p style={{ color: "red" }}>{"Incorrect password"}</p> : ""}
                                                        </div>
                                                        <button type="submit" class="btn btn-primary">Submit</button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                    <div style={{ marginTop: '2%' }}>
                                                        <Link to="/ForgotPassword">Forgot Password?</Link>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="col s8">
                                                <div style={{ marginTop: '20%' }}>
                                                    <div id="home_banner_container">
                                                        GoLogoLo
                                    </div>
                                                </div>
                                                <div style={{ marginTop: '5%' }}>
                                                    <Link to="/SignUp"><h3>Sign Up for a new account</h3></Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }}
                        </Query>
                    );
                }}
            </Mutation>

        );
    }
}

export default SignInScreen;
