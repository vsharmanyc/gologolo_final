import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_USER = gql`
query user($email: String) {
    user(email: $email) {
        email
    }
}
`;

const UPDATE_PswResetCode = gql`
    mutation updatePswResetCode($email: String!, $pswResetCode: String!) {
        updatePswResetCode(email: $email, pswResetCode: $pswResetCode) {
            email
            pswResetCode
        }
    }
`;

const bcrypt = require('bcrypt-nodejs');

class VerifyEmail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailVerified: false,
            email: "",
            pswResetCode: "",
        }
    }



    render() {
        let email;

        console.log(this.state)
        return (
            <div>{this.props.disabled ? <></> :
                <Mutation mutation={UPDATE_PswResetCode}>
                    {(updatePswResetCode, { loading, error, data }) => {
                        console.log(data);
                        if (data && !this.state.emailVerified && this.state.pswResetCode !== "") {
                            this.setState({ emailVerified: true });
                            this.props.onVerifyComplete({
                                email: this.state.email,
                                emailVerified: true,
                                pswResetCode: this.state.pswResetCode
                            })

                        }

                        return (
                            <Query fetchPolicy="no-cache" query={GET_USER} variables={{ email: this.state.email }}>
                                {({ loading, error, data }) => {
                                    if (data.user && this.state.pswResetCode === "" && !this.state.emailVerified) {
                                        //generate random password reset code
                                        let pswResetCode = "";
                                        for (let i = 0; i < 15; i++) {
                                            let rangeChoice = Math.floor(Math.random() * 3);
                                            let ascii = NaN;
                                            if (rangeChoice === 0)
                                                ascii = Math.floor(Math.random() * (58 - 48)) + 48;
                                            else if (rangeChoice === 1)
                                                ascii = Math.floor(Math.random() * (91 - 65)) + 65;
                                            else
                                                ascii = Math.floor(Math.random() * (123 - 97)) + 97;
                                            pswResetCode += String.fromCharCode(ascii);
                                        }

                                        bcrypt.genSalt(10, (error, salt) => {
                                            bcrypt.hash(pswResetCode, salt, null, (error, hash) => {
                                                if (error)
                                                    return
                                                if (this.state.pswResetCode === "" && !this.state.emailVerified) {
                                                    updatePswResetCode({
                                                        variables: {
                                                            email: this.state.email,
                                                            pswResetCode: hash
                                                        }
                                                    })
                                                    console.log("emailed psw reset code: " + pswResetCode);
                                                    console.log("and its hash: " + hash);
                                                    this.setState({ pswResetCode: pswResetCode });
                                                }
                                            })
                                        });
                                    }

                                    return (
                                        <div className="container" id="user_enter_container">
                                            <div className="container row">
                                                <div className="col s4">
                                                    <h3 id="recent_work_heading">Change Password</h3>
                                                    <div id="sign_in">
                                                        <form onSubmit={e => {
                                                            e.preventDefault();
                                                            this.setState({ email: email.value })
                                                        }}>
                                                            <div class="form-group">
                                                                <label for="email">Email address</label>
                                                                <input type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" required
                                                                    ref={node => { email = node; }} />
                                                                {this.state.email !== "" && !loading && !error && !data.user ? <p style={{ color: "red" }}>{this.state.email + " is not a user"}</p> : ""}
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
                                    )
                                }}
                            </Query>);
                    }}
                </Mutation>}
            </div>
        );
    }
}

export default VerifyEmail;
