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
        console.log(event.key);
    }

    toggleDropDown = (e) => {
        this.setState({ dropDownOpen: !this.state.dropDownOpen });
    }

    render() {
        if (!this.props.location.others)
            this.props.history.push("/SignIn");

        return (!this.props.location.others ? <></> :
            <Mutation mutation={UPDATE_SIGNEDIN}>
                {(updateSignedIn, { loading, error, data }) => {
                    console.log(data);
                    if (data) {
                        this.props.history.push({
                            pathname: '/SignIn',
                            state: { screenName: "HomeScreen" },
                            others: { email: this.props.location.others.email }
                        });
                    }

                    return (

                        <Query pollInterval={500} query={GET_LOGOS} variables={{ email: this.props.location.others.email }}>
                            {({ loading, error, data }) => {
                                console.log(data);
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
                                                            {this.props.location.others.email}
                                                        </button>
                                                        <div class={this.state.dropDownOpen ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton">
                                                            <a class="dropdown-item" href="#" onClick={(e) => {
                                                                updateSignedIn({
                                                                    variables: {
                                                                        email: this.props.location.others.email,
                                                                        signedIn: false
                                                                    }
                                                                });
                                                            }}>Sign Out</a>
                                                            <a class="dropdown-item" href="#">Change Password</a>
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
                                                                <Link to={`/view/${logo._id}`} class="home_work_link">{logo.workName.replace(/\s/g, '\u00A0')}</Link>
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
                                                                state: { screenName: "HomeScreen" },
                                                                others: { email: this.props.location.others.email }
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
