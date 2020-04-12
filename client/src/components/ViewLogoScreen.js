import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

const GET_LOGO = gql`
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderRadius
            borderWidth
            padding
            margin
            lastUpdate
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
        return (
            <Query pollInterval={500} query={GET_LOGO} variables={{ logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="container">
                            <div className="panel panel-default">

                                <div className="row" id="work_body_container">
                                    <h4 className="container" class="home_link_container"><Link to="/" class="home_link">GoLogoLo Home</Link></h4>
                                    <h3 className="container">View Logo</h3>

                                    <div className="panel-body">
                                        <dl className="container" id="properties_container">
                                            <dt>Text:</dt>
                                            <dd>{data.logo.text.replace(/\s/g, '\u00A0')}</dd>
                                            <dt>Color:</dt>
                                            <dd><input type="color" value={data.logo.color} disabled />{" " + data.logo.color}</dd>
                                            <dt>Font Size:</dt>
                                            <dd>{data.logo.fontSize}</dd>
                                            <dt>Background Color:</dt>
                                            <dd><input type="color" value={data.logo.backgroundColor} disabled />{" " + data.logo.backgroundColor}</dd>
                                            <dt>Border Color:</dt>
                                            <dd><input type="color" value={data.logo.borderColor} disabled />{" " + data.logo.borderColor}</dd>
                                            <dt>Border Radius:</dt>
                                            <dd>{data.logo.borderRadius}</dd>
                                            <dt>Border Width:</dt>
                                            <dd>{data.logo.borderWidth}</dd>
                                            <dt>Padding:</dt>
                                            <dd>{data.logo.padding}</dd>
                                            <dt>Margin:</dt>
                                            <dd>{data.logo.margin}</dd>
                                            <dt>Last Updated:</dt>
                                            <dd>{data.logo.lastUpdate}</dd>
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
                                            color: data.logo.color,
                                            fontSize: data.logo.fontSize + "pt",
                                            backgroundColor: data.logo.backgroundColor,
                                            borderColor: data.logo.borderColor,
                                            borderRadius: data.logo.borderRadius + "pt",
                                            borderWidth: data.logo.borderWidth + "pt",
                                            borderStyle: "solid",
                                            padding: data.logo.padding + "pt",
                                            margin: data.logo.margin + "pt",
                                            overflow: 'auto',
                                            position: 'absolute',
                                        }}>
                                            {data.logo.text}
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