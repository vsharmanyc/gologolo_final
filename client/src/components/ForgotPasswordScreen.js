import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import VerifyEmail from './VerifyEmail'

const GET_PswResetCode = gql`
query user($email: String) {
    user(email: $email) {
        pswResetCode
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

class ForgotPasswordScreenEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPasswordChangedModal: false,
            showEmailSentModal: false,
            emailVerified: false,
            email: "",
            pswResetCode: "",
            newPsw: "",
            confirmPsw: "",
            wrongPswResetCode: false,
            badNewPswError: "",
            badConfirmPsw: false,
        }
    }

    onVerifyComplete = (data) => {
        console.log(data);

        fetch(`http://localhost:3000/forgot-password-email?to=${data.email}&pswResetCode=${data.pswResetCode}`);

        this.setState({ email: data.email, emailVerified: data.emailVerified, showEmailSentModal: true })
    }



    render() {
        if (localStorage.getItem('signedInUser'))
            this.props.history.push("/");

        let pswResetCode, newPsw, confirmPsw;

        return (
            <div>
                {this.state.showEmailSentModal ? <div
                    className={'modal fade show'}
                    tabIndex="-1"
                    role="dialog"
                    aria-hidden="true"
                    style={{ display: "inline-block", textAlign: "center" }}
                >
                    <div className="modal-dialog" role="document" >
                        <div className="modal-content" style={{ padding: "5%" }}>
                            <h5>A password reset code has been sent to your email. Use the code to reset your account password</h5>
                            <button class="btn btn-primary" onClick={(e) => { this.setState({ showEmailSentModal: false }) }}>OK</button>
                        </div>
                    </div>
                </div> : <></>}

                <VerifyEmail onVerifyComplete={this.onVerifyComplete} disabled={this.state.emailVerified}></VerifyEmail>

                {this.state.emailVerified ?
                    <Mutation mutation={UPDATE_PASSWORD}>
                        {(updatePassword, { loading, error, data }) => {

                            if (data && !this.state.showPasswordChangedModal) {
                                console.log(data)
                                this.setState({ showPasswordChangedModal: true, wrongPswResetCode: false });
                            }

                            return (
                                <Query fetchPolicy="no-cache" query={GET_PswResetCode} variables={{ email: this.state.email }}>
                                    {({ loading, error, data }) => {

                                        if (data && data.user && this.state.newPsw !== "" && !this.state.showPasswordChangedModal) {
                                            bcrypt.compare(this.state.pswResetCode, data.user.pswResetCode, async (error, result) => {
                                                if (error) return;

                                                let wrongPswResetCode = true;
                                                if (result) {
                                                    wrongPswResetCode = !result;
                                                    console.log(result)
                                                }

                                                let badNewPswError = "";
                                                if (this.state.newPsw.length < 4)
                                                    badNewPswError = "New Password length should be atleast 4";

                                                let badConfirmPsw = this.state.newPsw !== this.state.confirmPsw;

                                                if (!wrongPswResetCode && badNewPswError === "" && !badConfirmPsw) {
                                                    bcrypt.genSalt(10, (error, salt) => {
                                                        bcrypt.hash(this.state.newPsw, salt, null, (error, hash) => {
                                                            if (error)
                                                                return
                                                            if (!this.state.showEmailSentModal) {
                                                                updatePassword({
                                                                    variables: {
                                                                        email: this.state.email,
                                                                        password: hash
                                                                    }
                                                                });
                                                                console.log("new psw hash: " + hash);
                                                            }
                                                        })
                                                    });
                                                }
                                                else
                                                    this.setState({ wrongPswResetCode: wrongPswResetCode, badNewPswError: badNewPswError, badConfirmPsw: badConfirmPsw, newPsw: "" });

                                            })
                                        }

                                        return (
                                            <div className="container" id="user_enter_container">

                                                {this.state.showPasswordChangedModal ? <div
                                                    className={'modal fade show'}
                                                    tabIndex="-1"
                                                    role="dialog"
                                                    aria-hidden="true"
                                                    style={{ display: "inline-block", textAlign: "center" }}
                                                >
                                                    <div className="modal-dialog" role="document" >
                                                        <div className="modal-content" style={{ padding: "5%" }}>
                                                            <h3>Password Change Successful!</h3>
                                                            <a href='/SignIn'><button class="btn btn-primary">Return to Sign In</button></a>
                                                        </div>
                                                    </div>
                                                </div> : <></>}

                                                <div className="container row">
                                                    <div className="col s4">
                                                        <h3 id="recent_work_heading">Change Password</h3>
                                                        <div id="sign_in">
                                                            <form onSubmit={e => {
                                                                e.preventDefault();
                                                                this.setState({
                                                                    pswResetCode: pswResetCode.value,
                                                                    newPsw: newPsw.value,
                                                                    confirmPsw: confirmPsw.value,
                                                                });

                                                            }}>
                                                                <div class="form-group">
                                                                    <label for="pswResetCode">Password Reset Code</label>
                                                                    <input type="text" class="form-control" id="pswResetCode" placeholder="Password Reset Code" required
                                                                        ref={node => { pswResetCode = node; }} />
                                                                    {this.state.wrongPswResetCode ? <p style={{ color: "red" }}>{"Incorrect Password Reset Code"}</p> : ""}
                                                                </div>
                                                                <div class="form-group">
                                                                    <label for="new">New Password</label>
                                                                    <input type="password" class="form-control" id="new" placeholder="New Password" required
                                                                        ref={node => { newPsw = node; }} />
                                                                    <p style={{ color: "red" }}>{this.state.badNewPswError}</p>
                                                                </div>
                                                                <div class="form-group">
                                                                    <label for="confirm">Confirm New Password</label>
                                                                    <input type="password" class="form-control" id="confirm" placeholder="Confirm Password" required
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
                                                                <Link to="/SignIn"><h3>Return to Sign In</h3></Link>
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
                    </Mutation> : <></>}
            </div>
        );
    }
}

export default ForgotPasswordScreenEdit;
