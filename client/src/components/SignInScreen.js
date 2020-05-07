import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_LOGOS = gql`
  {
    logos {
      _id
      text
      lastUpdate
    }
  }
`;

class SignInScreen extends Component {


    render() {
        return (

            <div className="container" id="home_screen_container">
                <div className="container row">
                    <div className="col s4">
                        <h3 id="recent_work_heading">Sign In</h3>
                        <div id="sign_in">
                            <form>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" required/>
                                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" required/>
                                    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <div style={{ marginTop: '2%' }}>
                                    <Link to="/create">Forgot Password?</Link>
                                </div>
                            </form>
                        </div>

                    </div>
                    <div className="col s8">
                        <div style={{ marginTop: '20%' }}>
                            <div id="home_banner_container">
                                GoLogoLo
                            </div>
                        </div>
                        <div style={{ marginTop: '5%' }}>
                            <Link to="/SignUp"><h3>Sign Up for new account</h3></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignInScreen;
