import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { schemaDefinitionNotAloneMessage } from 'graphql/validation/rules/LoneSchemaDefinition';

const GET_LOGOS = gql`
  {
    logos {
      _id
      text
      lastUpdate
    }
  }
`;

class SignUpScreen extends Component {

    constructor(props) {
        super(props);

        // WE'LL MANAGE THE UI CONTROL
        // VALUES HERE
        this.state = {
            email: "",
            validEmail: "",
            password: "",
            validPassword: ""
        }
    }

    submit = (event) =>{

    }

    setInfo = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    onReset = (event) => {
        
    }

    render() {
        return (

            <div className="container" id="home_screen_container">
                <div className="container row">
                    <div className="col s4">
                        <h3 id="recent_work_heading">Sign Up</h3>
                        <div id="sign_in">
                            <form reset={this.onReset}>
                                <div class="form-group">
                                    <label for="exampleInputEmail1">Email address</label>
                                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" defaultValue={this.state.email} onChange={this.setInfo}/>
                                    <small id="emailHelp" class="form-text text-muted">{this.state.validEmail}</small>
                                </div>
                                <div class="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" defaultValue={this.state.password} onChange={this.setInfo}/>
                                    <small id="emailHelp" class="form-text text-muted">{this.state.validPassword}</small>
                                </div>
                                <button class="btn btn-primary" onClick={this.submit}>Submit</button>
                            </form>
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
        );
    }
}

export default SignUpScreen;
