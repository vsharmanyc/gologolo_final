import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import { Rnd } from 'react-rnd';
import html2canvas from 'html2canvas'

const GET_LOGO = gql`
    query logo($email: String!, $logoId: String!) {
        logo(email:$email, logoId: $logoId) {
            logos {
                _id
                workName
                images{
                    link
                    x
                    y
                    width
                    height
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
  mutation removeLogo($email: String!, $logoId: String!) {
    removeLogo(email: $email, logoId: $logoId) {
        logos{
            _id
        }
    }
  }
`;


class ViewLogoScreen extends Component {
    constructor(props) {
        super(props);

        // WE'LL MANAGE THE UI CONTROL
        // VALUES HERE
        this.state = {
            showModal: false,
            imageData: null
        }
    }

    exportLogo = (event) => {
        html2canvas(document.querySelector("#logo"), {
            useCORS: true,
            proxy: "Server"
        }).then(canvas => {
            let imageData = canvas.toDataURL('image/jpeg');
            this.setState({ showModal: true, imageData: imageData });
        })
    }

    downloadImage = (event) => {
        let logoImage = new Image();
        logoImage.src = this.state.imageData;
    }

    render() {
        let email = localStorage.getItem('signedInUser');
        if (!email)
            this.props.history.push("/SignIn");
        let logo = {};

        let disabledResize = {
            bottom: false,
            bottomLeft: false,
            bottomRight: false,
            left: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false
        };
        return (
            <Query pollInterval={500} query={GET_LOGO} variables={{ email: email, logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    logo = data.logo.logos[0];
                    console.log(data);

                    return (!data ? <></> :
                        <div className="container">
                            <div className="panel panel-default">

                                <div className="row" id="work_body_container">
                                    <h4 className="container" class="home_link_container"><Link to={{
                                        pathname: '/',
                                        state: { screenName: "CreateLogoScreen" }
                                    }} class="home_link">GoLogoLo Home</Link></h4>
                                    <div className="container row">
                                        <h3 className="container col">View Logo</h3>
                                        <button type="button" class="btn btn-info btn-lg" onClick={this.exportLogo}>Export Logo</button>
                                        {this.state.showModal ? <div
                                            className={'modal fade show'}
                                            tabIndex="-1"
                                            role="dialog"
                                            aria-hidden="true"
                                            style={{ display: "inline-block", textAlign: "center" }}
                                        >
                                            <div className="modal-dialog" role="document" >
                                                <div className="modal-content" style={{ padding: "5%" }}>
                                                    <h3>Your Logo has been exported</h3>
                                                    <div>
                                                        <a href={this.state.imageData} download={`${logo.workName}.png`} style={{ paddingRight: "10px" }}>
                                                            <button class="btn btn-primary"  onClick={() => this.setState({ showModal: false })}>Download</button>
                                                        </a>
                                                        <button class="btn btn-primary" onClick={() => this.setState({ showModal: false })}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> : <></>}
                                    </div>

                                    <div className="panel-body">
                                        <dl className="container" id="properties_container">
                                            <dt>Work Name:</dt>
                                            <dd>{logo.workName}</dd>
                                            <dt>Texts:</dt>
                                            <dd>{logo.texts.length === 0 ? <p>None</p> : <div style={{ overflowY: "scroll", height: "180px", overflow: "auto", width: "300px" }}>
                                                {logo.texts.map((text, index) => (<dl style={{ backgroundColor: "#a1cea1", borderStyle: "solid", paddingLeft: "5%" }}>
                                                    <dt>Text:</dt>
                                                    <dd><span>{text.text.replace(/\s/g, '\u00A0')}</span></dd>
                                                    <dt>Color:</dt>
                                                    <dd><input type="color" value={text.color} disabled />{" " + text.color}
                                                        <dt>Font Size:</dt>
                                                        <dd></dd>{text.fontSize}</dd>
                                                </dl>))}
                                            </div>}</dd>
                                            <dt>Images:</dt>
                                            <dd>{logo.images.length === 0 ? <p>None</p> : <div style={{ overflowY: "scroll", height: "180px", overflow: "auto", width: "300px" }}>
                                                {logo.images.map((image, index) => (<dl style={{ backgroundColor: "#a1cea1", borderStyle: "solid", paddingLeft: "5%", overflow: "overlay" }}>
                                                    <dt>Link:</dt>
                                                    <dd >{image.link}</dd>
                                                    <img src={image.link} height="100px" width="100px"></img>
                                                </dl>))}
                                            </div>}</dd>
                                            <dt>Background Color:</dt>
                                            <dd><input type="color" value={logo.backgroundColor} disabled />{" " + logo.backgroundColor}</dd>
                                            <dt>Border Color:</dt>
                                            <dd><input type="color" value={logo.borderColor} disabled />{" " + logo.borderColor}</dd>
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

                                        <Mutation mutation={DELETE_LOGO} key={logo._id} onCompleted={() => this.props.history.push('/')}>
                                            {(removeLogo, { loading, error }) => (
                                                <div>
                                                    <form
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            removeLogo({ variables: { email: email, logoId: logo._id } });
                                                        }}>
                                                        <Link to={`/edit/${logo._id}`} className="btn btn-success">Edit</Link>&nbsp;
                                                <button type="submit" className="btn btn-danger">Delete</button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>
                                            )}
                                        </Mutation>
                                    </div>
                                    <div className="col s8">
                                        <div id="logo" className="box"
                                            style={{
                                                backgroundColor: logo.backgroundColor,
                                                borderColor: logo.borderColor,
                                                borderRadius: logo.borderRadius + "pt",
                                                borderWidth: logo.borderWidth + "pt",
                                                borderStyle: "solid",
                                                padding: logo.padding + "pt",
                                                margin: logo.margin + "pt",
                                                position: 'absolute'
                                            }}>

                                            {logo.texts.map((text, index) => (
                                                <Rnd bounds=".box"
                                                    key={index}
                                                    enableResizing={disabledResize}
                                                    position={{ x: text.x, y: text.y }}
                                                    style={{
                                                        color: text.color,
                                                        fontSize: text.fontSize + "pt"
                                                    }}>
                                                    {text.text.replace(/\s/g, '\u00A0')}
                                                </Rnd>
                                            ))}

                                            {logo.images.map((image, index) => (
                                                <Rnd
                                                    bounds=".box"
                                                    disableDragging="true"
                                                    enableResizing={disabledResize}
                                                    size={{ width: image.width, height: image.height }}
                                                    position={{ x: image.x, y: image.y }}
                                                >
                                                    <img src={image.link} width={image.width + ""} height={image.height + ""} />
                                                </Rnd>
                                            ))}

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