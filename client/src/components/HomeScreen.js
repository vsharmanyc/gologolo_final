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

class HomeScreen extends Component {

    render() {
        return (
            <Query pollInterval={500} query={GET_LOGOS}>
                {({ loading, error, data }) => {
                    if (data.logos !== undefined)
                        data.logos.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="container" id="home_screen_container">
                            <div className="container row">
                                <div className="col s4">
                                    <h3 id="recent_work_heading">Recent Work</h3>
                                    {data.logos.map((logo, index) => (
                                        <div key={index} className='home_logo_link'
                                            style={{ cursor: "pointer" }}>
                                            <Link to={`/view/${logo._id}`} class="home_work_link">{logo.text.replace(/\s/g, '\u00A0')}</Link>
                                        </div>
                                    ))}
                                </div>
                                <div className="col s8">
                                    <div id="home_banner_container">
                                        GoLogoLo
                                    </div>
                                    <div>
                                        <Link id="add_logo_button" to="/create"><button id="new_logo_button">Create New Logo</button></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            </Query >
        );
    }
}

export default HomeScreen;
