import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_USERS = gql`
{
    users{
      email
    }
}
`;

const ADD_USER = gql`
  mutation addUser($email: String!, $password: String!, $signedIn: Boolean!) {
    addUser(email: $email, password: $password, signedIn: $signedIn) {
      email
    }
  }
`;

const bcrypt = require('bcrypt-nodejs');

class SignUpScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userExistsErrorMsg: "",
            isBadPswLength: false
        }
    }

    setUserExistsErrorMsg(errorMsg) {
        this.setState({ userExistsErrorMsg: errorMsg });
    }

    badPswLength(isBadPswLength) {
        this.setState({ isBadPswLength: isBadPswLength });
    }

    render() {
        let email, password, users;
        return (
            <Query pollInterval={500} query={GET_USERS}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    users = data.users;

                    return (
                        <Mutation mutation={ADD_USER} >
                            {(addUser, { loading, error, data }) => {
                                if (data) {
                                    console.log("email is : " + email.value);
                                    this.props.history.push({
                                        pathname: '/home',
                                        state: { screenName: "SignUpScreen" },
                                        others: { email: email.value }
                                    });
                                }

                                return (
                                    <div className="container" id="user_enter_container">
                                        <div className="container row">
                                            <div className="col s4">
                                                <h3 id="recent_work_heading">Sign Up</h3>
                                                <div id="sign_in">
                                                    <form onSubmit={e => {
                                                        e.preventDefault();
                                                        let isNewUser = users.filter(user => user.email === email.value).length === 0;
                                                        if (isNewUser && password.value.length >= 4) {
                                                            let pswVal = password.value;
                                                            let emailVal = email.value;
                                                            bcrypt.genSalt(10, (error, salt) => {
                                                                bcrypt.hash(pswVal, salt, null, (error, hash) => {
                                                                    if (error)
                                                                        return
                                                                    addUser({
                                                                        variables: {
                                                                            email: emailVal,
                                                                            password: hash,
                                                                            signedIn: true
                                                                        }
                                                                    });
                                                                })
                                                            });
                                                        }
                                                        else {
                                                            this.setUserExistsErrorMsg(!isNewUser ? email.value + " is already a user" : "");
                                                            this.badPswLength(password.value.length < 4);
                                                        }
                                                    }}>

                                                        <div class="form-group">
                                                            <label for="exampleInputEmail1">Email address</label>
                                                            <input type="email" class="form-control" id="exampleInputEmail1" required placeholder="Enter email"
                                                                ref={node => { email = node; }} />
                                                            {this.state.userExistsErrorMsg !== "" ? <p style={{ color: "red" }}>{this.state.userExistsErrorMsg}</p> : ""}
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="exampleInputPassword1">Password</label>
                                                            <input type="password" class="form-control" id="exampleInputPassword1" required placeholder="Password"
                                                                ref={node => { password = node; }} />
                                                            {this.state.isBadPswLength ? <p style={{ color: "red" }}>{"Password length should be atleast 4"}</p> : ""}
                                                        </div>
                                                        <button class="btn btn-primary">Submit</button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>

                                            </div>
                                            <div className="col s8">
                                                <div style={{ marginTop: '20%' }}>
                                                    <div id="home_banner_container">
                                                        GoLogoLo
                                                               </div>
                                                    <div style={{ marginTop: '5%' }}>
                                                        <Link to="/"><h3>Return to Sign In</h3></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default SignUpScreen;
