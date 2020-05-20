import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_LOGOS = gql`
query user($email: String) {
    user(email: $email) {
        signedIn
        logos {
            _id
            workName
            lastUpdate
        }
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

class HomeScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dropDownOpen: false
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.closeDropDownViaEscape);
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.closeDropDownViaEscape);
    }

    closeDropDownViaEscape = (event) => {
        if (event.key === "Escape" && this.state.dropDownOpen)
            this.setState({ dropDownOpen: false });
    }

    toggleDropDown = (e) => {
        this.setState({ dropDownOpen: !this.state.dropDownOpen });
    }

    render() {
        let email = localStorage.getItem('signedInUser');
        if (!email)
            this.props.history.push("/SignIn");

        return (!email ? <></> :
            <Mutation mutation={UPDATE_SIGNEDIN}>
                {(updateSignedIn, { loading, error, data }) => {
                    if (data) {
                        this.props.history.push({
                            pathname: '/SignIn',
                            state: { screenName: "HomeScreen" }
                        });
                    }

                    return (

                        <Query pollInterval={500} query={GET_LOGOS} variables={{ email: email }}>
                            {({ loading, error, data }) => {
                                if (data.user)
                                    data.user.logos.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
                                if (loading) return 'Loading...';
                                if (error) return `Error! ${error.message}`;

                                return (
                                    <div>

                                        <div >
                                            <div className="container" style={{ padding: "3px", backgroundColor: "#9aa036", borderColor: "black", marginTop: "2%" }}>
                                                <div className="container row">
                                                    <div className="col s4"><h3><strong>GoLogoLo</strong></h3></div>
                                                    <div className="col s8" class="dropdown">
                                                        <button class="btn btn-primary dropdown-toggle" style={{ backgroundColor: "#c1c85b", color: "black", borderColor: "black" }} type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.dropDownOpen}
                                                            onClick={this.toggleDropDown} >
                                                            {email}
                                                        </button>
                                                        <div class={this.state.dropDownOpen ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton">
                                                            <a class="dropdown-item" href="#" onClick={(e) => {
                                                                localStorage.removeItem('signedInUser');
                                                                updateSignedIn({
                                                                    variables: {
                                                                        email: email,
                                                                        signedIn: false
                                                                    }
                                                                });
                                                            }}>Sign Out</a>
                                                            <a class="dropdown-item" href="/ChangePassword">Change Password</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="container" id="home_screen_container">


                                                <div className="container row">
                                                    <div className="col s4">
                                                        <h3 id="recent_work_heading">Recent Work</h3>
                                                        {data.user.logos.map((logo, index) => (
                                                            <div key={index} className='home_logo_link'
                                                                style={{ cursor: "pointer" }}>
                                                                <Link to={{
                                                                    pathname: `/view/${logo._id}`,
                                                                    state: { screenName: "HomeScreen" }
                                                                }} class="home_work_link">{logo.workName.replace(/\s/g, '\u00A0')}</Link>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="col s8">
                                                        <div id="home_banner_container">
                                                            GoLogoLo
                                                    </div>
                                                        <div>
                                                            <Link id="add_logo_button" to={{
                                                                pathname: '/Create',
                                                                state: { screenName: "HomeScreen" }
                                                            }}><button id="new_logo_button">Create New Logo</button></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            }
                        </Query >
                    );
                }}
            </Mutation>
        );
    }
}

export default HomeScreen;
