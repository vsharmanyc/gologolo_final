import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_LOGO = gql`
    query logo($email: String!, $logoId: String!) {
        logo(email:$email, logoId: $logoId) {
            logos {
                workName
                images{
                    link
                    x
                    y
                }
                texts{    
                    text
                    color
                    fontSize
                    x
                    y
                }
                backgroundColor
                borderColor
                borderRadius
                borderWidth
                padding
                margin
                lastUpdate
            }
        }
    }
`;

const DELETE_LOGO = gql`
  mutation removeLogo($id: String!) {
    removeLogo(id:$id) {
      _id
    }
  }
`;

class ViewLogoScreen extends Component {

    render() {
        let email = localStorage.getItem('signedInUser');
        if (!email)
            this.props.history.push("/SignIn");
        let logo = {};
    return (
            <Query pollInterval={500} query={GET_LOGO} variables={{email: email, logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    logo = data.logo.logos[0];

                    return (!data ? <></> :
                        <div className="container">
                            <div className="panel panel-default">

                                <div className="row" id="work_body_container">
                                    <h4 className="container" class="home_link_container"><Link to={{
                                        pathname: '/',
                                        state: { screenName: "CreateLogoScreen" }
                                    }} class="home_link">GoLogoLo Home</Link></h4>
                                    <h3 className="container">View Logo</h3>

                                    <div className="panel-body">
                                        <dl className="container" id="properties_container">
                                            <dt>Text:</dt>
                                            <dd>{logo.workName.replace(/\s/g, '\u00A0')}</dd>
                                            <dt>Background Color:</dt>
                                            <dd><input type="color" value={logo.backgroundColor} disabled />{" " + data.logo.backgroundColor}</dd>
                                            <dt>Border Color:</dt>
                                            <dd><input type="color" value={logo.borderColor} disabled />{" " + data.logo.borderColor}</dd>
                                            <dt>Border Radius:</dt>
                                            <dd>{logo.borderRadius}</dd>
                                            <dt>Border Width:</dt>
                                            <dd>{logo.borderWidth}</dd>
                                            <dt>Padding:</dt>
                                            <dd>{logo.padding}</dd>
                                            <dt>Margin:</dt>
                                            <dd>{logo.margin}</dd>
                                            <dt>Last Updated:</dt>
                                            <dd>{logo.lastUpdate}</dd>
                                        </dl>

                                        <Mutation mutation={DELETE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push('/')}>
                                            {(removeLogo, { loading, error }) => (
                                                <div>
                                                    <form
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            removeLogo({ variables: { id: data.logo._id } });
                                                        }}>
                                                        <Link to={`/edit/${data.logo._id}`} className="btn btn-success">Edit</Link>&nbsp;
                                                <button type="submit" className="btn btn-danger">Delete</button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>
                                            )}
                                        </Mutation>
                                    </div>

                                    <div className="col s8">
                                        <div style={{
                                            backgroundColor: logo.backgroundColor,
                                            borderColor: logo.borderColor,
                                            borderRadius: logo.borderRadius + "pt",
                                            borderWidth: logo.borderWidth + "pt",
                                            borderStyle: "solid",
                                            padding: logo.padding + "pt",
                                            margin: logo.margin + "pt",
                                            overflow: 'auto',
                                            position: 'absolute',
                                        }}>
                                            {logo.workName.replace(/\s/g, '\u00A0')}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default ViewLogoScreen;