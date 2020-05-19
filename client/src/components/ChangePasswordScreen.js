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

const UPDATE_PASSWORD = gql`
    mutation updatePassword($email: String!, $password: String!) {
        updatePassword(email: $email, password: $password) {
            email
            password
        }
    }
`;

const bcrypt = require('bcrypt-nodejs');

class ChangePasswordScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            wrongCurrentPsw: false,
            badNewPswError: "",
            badConfirmPsw: false,
            showModal: false,
        }
    }
    


    render() {

        let email, currentPsw, newPsw, confirmPsw;
        email = localStorage.getItem('signedInUser');

        if (!email)
            this.props.history.push("/SignIn");

        console.log(this.state)

        return (
            <Mutation mutation={UPDATE_PASSWORD}>
                {(updatePassword, { loading, error, data }) => {
                    console.log(data);
                    if (data && !this.state.showModal) {
                        this.setState({showModal : true});
                    }

                    return (
                        <Query query={GET_PSW} variables={{ email: email }}>
                            {({ loading, error, data }) => {

                                console.log(this.state)

                                return (

                                    <div className="container" id="user_enter_container">

                                        {this.state.showModal ? <div
                                            className={'modal fade show'}
                                            tabIndex="-1"
                                            role="dialog"
                                            aria-hidden="true"
                                            style={{ display: "inline-block", textAlign: "center" }}
                                        >
                                            <div className="modal-dialog" role="document" >
                                                <div className="modal-content" style={{ padding: "5%" }}>
                                                    <h3>Password Change Successful!</h3>
                                                    <a href='/'><button class="btn btn-primary">Return Home</button></a>
                                                </div>
                                            </div>
                                        </div> : <></>}

                                        <div className="container row">
                                            <div className="col s4">
                                                <h3 id="recent_work_heading">Change Password</h3>
                                                <div id="sign_in">
                                                    <form onSubmit={e => {
                                                        e.preventDefault();

                                                        if (data && data.user) {
                                                            bcrypt.compare(currentPsw.value, data.user.password, async (error, result) => {
                                                                if (error) return;

                                                                let wrongCurrentPsw = true;
                                                                if (result) {
                                                                    wrongCurrentPsw = !result;
                                                                    console.log(result)
                                                                }

                                                                let badNewPswError = "";
                                                                if (!wrongCurrentPsw && currentPsw.value === newPsw.value)
                                                                    badNewPswError = "New Password must be different from Current Password";
                                                                if (newPsw.value.length < 4)
                                                                    badNewPswError = "New Password length should be atleast 4";

                                                                let badConfirmPsw = newPsw.value !== confirmPsw.value;

                                                                if (!wrongCurrentPsw && badNewPswError == "" && !badConfirmPsw) {
                                                                    bcrypt.genSalt(10, (error, salt) => {
                                                                        bcrypt.hash(newPsw.value, salt, null, (error, hash) => {
                                                                            if (error)
                                                                                return
                                                                            updatePassword({
                                                                                variables: {
                                                                                    email: email,
                                                                                    password: hash
                                                                                }
                                                                            });
                                                                            console.log("new psw hash: " + hash);
                                                                        })
                                                                    });
                                                                }
                                                                else
                                                                    this.setState({ wrongCurrentPsw: wrongCurrentPsw, badNewPswError: badNewPswError, badConfirmPsw: badConfirmPsw });

                                                            })
                                                        }
                                                    }}>
                                                        <div class="form-group">
                                                            <label for="exampleInputPassword1">Current Password</label>
                                                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Current Password" required
                                                                ref={node => { currentPsw = node; }} />
                                                            {this.state.wrongCurrentPsw ? <p style={{ color: "red" }}>{"Incorrect password"}</p> : ""}
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="exampleInputPassword1">New Password</label>
                                                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="New Password" required
                                                                ref={node => { newPsw = node; }} />
                                                            <p style={{ color: "red" }}>{this.state.badNewPswError}</p>
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="exampleInputPassword1">Confirm New Password</label>
                                                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Confirm Password" required
                                                                ref={node => { confirmPsw = node; }} />
                                                            {this.state.badConfirmPsw ? <p style={{ color: "red" }}>{"Passwords do not match"}</p> : ""}
                                                        </div>
                                                        <button type="submit" class="btn btn-primary">Submit</button>
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
                                                        <Link to="/"><h3>Return Home</h3></Link>
                                                    </div>
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

export default ChangePasswordScreen;
