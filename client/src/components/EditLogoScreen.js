import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import { Rnd } from 'react-rnd';

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

const UPDATE_LOGO = gql`
    mutation updateLogo($email: String!, $logoId: String!, $updatedLogo: logoInput!){
        updateLogo(email: $email, logoId: $logoId, updatedLogo: $updatedLogo) {
            logos {
                _id
            }
        }
    }
`;

class EditLogoScreen extends Component {

    constructor(props) {
        super(props);

        // WE'LL MANAGE THE UI CONTROL
        // VALUES HERE
        this.state = {
            text: "",
            color: "#000000",
            fontSize: "",
            selectedTextKey: -1,
            texts: [],
            imageLink: "",
            selectedImageKey: -1,
            images: [],
            backgroundColor: "#000000",
            borderColor: "#000000",
            borderRadius: NaN,
            borderWidth: NaN,
            padding: NaN,
            margin: NaN,
            width: NaN,
            height: NaN,
        }
    }

    setStateWithQueryData(data) {
        for (let i = 0; i < data.texts.length; i++)
            delete data.texts[i]["__typename"]

        for (let i = 0; i < data.images.length; i++)
            delete data.images[i]["__typename"]

        this.setState({
            hasQueryData: true,
            texts: data.texts,
            images: data.images,
            backgroundColor: data.backgroundColor,
            borderColor: data.borderColor,
            borderRadius: data.borderRadius,
            borderWidth: data.borderWidth,
            padding: data.padding,
            margin: data.margin
        });
    }

    updateLogoView = (event) => {
        console.log("update logo view");
        this.setState({ [event.target.name]: event.target.value });
    }

    textPropsChange = (event) => {
        if (this.state.selectedTextKey >= 0) {
            let textProps = this.state.texts;
            let value = event.target.value;
            if (event.target.name === "fontSize")
                value = parseInt(value);
            textProps[this.state.selectedTextKey][event.target.name] = value;
            this.setState({ texts: textProps, [event.target.name]: value })
        }
        else
            this.setState({ [event.target.name]: event.target.value });
    }

    addText = (event) => {
        let textProps = this.state.texts;

        let fontSize = parseInt(this.state.fontSize)
        if (this.state.fontSize === "")
            fontSize = 20;

        textProps.push({ text: this.state.text, color: this.state.color, fontSize: fontSize, x: 0, y: 0 });
        this.setState({ texts: textProps, text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
    }

    deleteText = (event) => {
        let textProps = this.state.texts;
        textProps.splice(this.state.selectedTextKey, 1);
        this.setState({ texts: textProps, text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
    }

    deselectText = (event) => {
        this.setState({ texts: this.state.texts.filter(text => text.text !== ""), text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
    }

    textSelected(key) {
        let text = this.state.texts[key];
        this.setState({
            text: text.text,
            color: text.color,
            fontSize: text.fontSize,
            selectedTextKey: key
        });
    }

    imageLinkChange = (event) => {
        if (this.state.selectedImageKey >= 0) {
            let images = this.state.images;
            images[this.state.selectedImageKey].link = event.target.value;
            this.setState({ images: images, imageLink: event.target.value })
        }
        else
            this.setState({ imageLink: event.target.value });
    }

    addImage = (event) => {
        let images = this.state.images;
        images.push({ link: this.state.imageLink, x: 0, y: 0 });
        this.setState({ images: images, imageLink: "", selectedImageKey: -1 });
    }

    deleteImage = (event) => {
        let images = this.state.images;
        images.splice(this.state.selectedImageKey, 1);
        this.setState({ images: images, imageLink: "", selectedImageKey: -1 });
    }

    deselectImage = (event) => {
        this.setState({ images: this.state.images.filter(image => image.link !== ""), imageLink: "", selectedImageKey: -1 });
    }

    imageSelected(key) {
        let image = this.state.images[key];
        this.setState({
            imageLink: image.link,
            selectedImageKey: key
        });
    }

    textDragStopped = (event, d) => {
        if (this.state.selectedTextKey !== -1) {
            let texts = this.state.texts;
            texts[this.state.selectedTextKey].x = Math.round(d.x);
            texts[this.state.selectedTextKey].y = Math.round(d.y);
            this.setState({ texts: texts });
        }
    }

    imageDrag = (event, d) => {
        if (this.state.selectedImageKey !== -1) {
            let images = this.state.images;
            images[this.state.selectedImageKey].x = Math.round(d.x);
            images[this.state.selectedImageKey].y = Math.round(d.y);
            this.setState({ images: images });
        }
    }

    imageResize = (e, direction, ref, delta, position) => {
        let index = this.state.selectedImageKey;
        if (index !== -1) {
            let images = this.state.images;
            images[index].width = ref.offsetWidth;
            images[index].height = ref.offsetHeight;
            this.setState({ images: images });
        }
    }

    onResize = (e, direction, ref, delta, position) => {
        this.setState({ width: ref.offsetWidth, height: ref.offsetHeight });
    }



    render() {
        let email = localStorage.getItem('signedInUser');
        if (!email)
            this.props.history.push("/SignIn");

        let image, text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        console.log(this.state);
        return (
            <Query query={GET_LOGO} variables={{ email: email, logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    if (!this.state.hasQueryData) this.setStateWithQueryData(data.logo.logos[0]);

                    return (
                        <Mutation mutation={UPDATE_LOGO} key={data.logo._id}>
                            {(updateLogo, { loading, error, data }) => {

                                if (data) {
                                    console.log("hello");
                                    console.log(data.updateLogo.logos[data.updateLogo.logos.length - 1]._id);
                                    this.props.history.push({
                                        pathname: `/view/${data.updateLogo.logos[data.updateLogo.logos.length - 1]._id}`,
                                        state: { screenName: "EditScreen" },
                                    });
                                }

                                return (
                                    <div className="container">
                                        <div className="panel panel-default">

                                            <div className="row" id="work_body_container">
                                                <h4 className="container" class="home_link_container"><Link to={{
                                                    pathname: '/',
                                                    state: { screenName: "CreateLogoScreen" },
                                                }} class="home_link">GoLogoLo Home</Link></h4>
                                                <div className="container row">
                                                    <h3 className="container col">Edit Logo</h3>
                                                    <h5 style={{ color: "teal", marginRight: "35%" }}>Click, Drag, or Resize to select texts and images</h5>
                                                </div>

                                                <div className="panel-body">
                                                    <form onSubmit={e => {
                                                        e.preventDefault();
                                                        let workName = "";
                                                        this.state.texts.forEach((textObject) => { workName += textObject.text });
                                                        if (workName === "")
                                                            workName = "Untitled"
                                                        updateLogo({
                                                            variables: {
                                                                email: email,
                                                                logoId: this.props.match.params.id,
                                                                updatedLogo: {
                                                                    workName: workName,
                                                                    texts: this.state.texts,
                                                                    images: this.state.images,
                                                                    backgroundColor: backgroundColor.value,
                                                                    borderColor: borderColor.value,
                                                                    borderRadius: parseInt(borderRadius.value),
                                                                    borderWidth: parseInt(borderWidth.value),
                                                                    padding: parseInt(padding.value),
                                                                    margin: parseInt(margin.value)
                                                                }
                                                            }
                                                        });
                                                        image.value = ""
                                                        text.value = "";
                                                        color.value = "";
                                                        fontSize.value = "";
                                                        backgroundColor.value = "";
                                                        borderColor.value = "";
                                                        borderRadius.value = "";
                                                        borderWidth.value = "";
                                                        padding.value = "";
                                                        margin.value = "";
                                                    }}>
                                                        <div className="container" id="properties_container">
                                                            <div id="group_properties_container">
                                                                <div className="form-group">
                                                                    <label htmlFor="text">Text:</label>
                                                                    <input type="text" className="form-control" name="text" pattern='.*[^\s].*' ref={node => {
                                                                        text = node;
                                                                    }} placeholder="Text" value={this.state.text} onChange={this.textPropsChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="color">Color:</label>

                                                                    <input type="color" className="form-control" name="color" ref={node => {
                                                                        color = node;
                                                                    }} placeholder="Color" value={this.state.color} onChange={this.textPropsChange} />

                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="fontSize">Font Size:</label>
                                                                    <input type="number" className="form-control" name="fontSize" min="0" max="144" ref={node => {
                                                                        fontSize = node;
                                                                    }} placeholder="Font Size" value={this.state.fontSize} onChange={this.textPropsChange} />
                                                                </div>
                                                                <div style={{ display: "inline-block" }}>
                                                                    <button disabled={this.state.selectedTextKey === -1} onClick={this.deselectText}>deselect</button>
                                                                    <button disabled={this.state.selectedTextKey === -1} onClick={this.deleteText}>delete</button>
                                                                    <button disabled={this.state.selectedTextKey >= 0 || !this.state.text.match(/.*[^\s].*/)} onClick={this.addText}>add</button>
                                                                </div>
                                                            </div>
                                                            <div id="group_properties_container">
                                                                <div className="form-group">
                                                                    <label htmlFor="image">Image:</label>
                                                                    <input type="url" className="form-control" name="link" ref={node => {
                                                                        image = node;
                                                                    }} placeholder="Image Link" value={this.state.imageLink} onChange={this.imageLinkChange} />
                                                                </div>
                                                                <div style={{ display: "inline-block" }}>
                                                                    <button disabled={this.state.selectedImageKey === -1} onClick={this.deselectImage}>deselect</button>
                                                                    <button disabled={this.state.selectedImageKey === -1} onClick={this.deleteImage}>delete</button>
                                                                    <button disabled={this.state.selectedImageKey >= 0 || this.state.imageLink.match(/^(?![\s\S])|\s/)} onClick={this.addImage}>add</button>
                                                                </div>
                                                            </div>
                                                            <div id="group_properties_container">
                                                                <div className="form-group">
                                                                    <label htmlFor="backgroundColor">Background Color:</label>
                                                                    <input type="color" className="form-control" name="backgroundColor" ref={node => {
                                                                        backgroundColor = node;
                                                                    }} placeholder="Background Color" value={this.state.backgroundColor} onChange={this.updateLogoView} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="borderColor">Border Color:</label>
                                                                    <input type="color" className="form-control" name="borderColor" ref={node => {
                                                                        borderColor = node;
                                                                    }} placeholder="Border Color" value={this.state.borderColor} onChange={this.updateLogoView} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="borderRadius">Border Radius:</label>
                                                                    <input type="number" className="form-control" name="borderRadius" min="0" ref={node => {
                                                                        borderRadius = node;
                                                                    }} placeholder="Border Radius" value={this.state.borderRadius} onChange={this.updateLogoView} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="borderWidth">Border Width:</label>
                                                                    <input type="number" className="form-control" name="borderWidth" min="0" ref={node => {
                                                                        borderWidth = node;
                                                                    }} placeholder="Border Width" value={this.state.borderWidth} onChange={this.updateLogoView} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="padding">Padding:</label>
                                                                    <input type="number" className="form-control" name="padding" min="0" ref={node => {
                                                                        padding = node;
                                                                    }} placeholder="Padding" value={this.state.padding} onChange={this.updateLogoView} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="margin">Margin:</label>
                                                                    <input type="number" className="form-control" name="margin" min="0" ref={node => {
                                                                        margin = node;
                                                                    }} placeholder="Margin" value={this.state.margin} onChange={this.updateLogoView} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button type="submit" className="btn btn-success">Submit</button>
                                                    </form>
                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>

                                                <div className="col s8">
                                                    <div className="box"
                                                        style={{
                                                            backgroundColor: this.state.backgroundColor,
                                                            borderColor: this.state.borderColor,
                                                            borderRadius: this.state.borderRadius + "pt",
                                                            borderWidth: this.state.borderWidth + "pt",
                                                            borderStyle: "solid",
                                                            padding: this.state.padding + "pt",
                                                            margin: this.state.margin + "pt",
                                                            position: 'absolute',
                                                            clear: "both"
                                                        }}>

                                                        {this.state.texts.map((text, index) => (
                                                            <Rnd bounds=".box" onDragStart={() => { this.textSelected(index) }} onDragStop={this.textDragStopped}
                                                                key={index} onClick={() => { this.textSelected(index) }}
                                                                position={{ x: text.x, y: text.y }}
                                                                style={{
                                                                    color: text.color,
                                                                    fontSize: text.fontSize + "pt",
                                                                    display: "inline-block"
                                                                }}
                                                                enableResizing={{
                                                                    bottom: false,
                                                                    bottomLeft: false,
                                                                    bottomRight: false,
                                                                    left: false,
                                                                    right: false,
                                                                    top: false,
                                                                    topLeft: false,
                                                                    topRight: false
                                                                }}>
                                                                {text.text.replace(/\s/g, '\u00A0')}
                                                            </Rnd>
                                                        ))}

                                                        {this.state.images.map((image, index) => (
                                                            <Rnd
                                                                bounds='.box'
                                                                minWidth="10"
                                                                minHeight="10"
                                                                size={{ width: image.width, height: image.height }}
                                                                position={{ x: image.x, y: image.y }}
                                                                onDragStart={() => { this.imageSelected(index) }}
                                                                onResizeStart={() => { this.imageSelected(index) }}
                                                                onDrag={this.imageDrag}
                                                                onDragStop={this.imageDrag}
                                                                onResize={this.imageResize}
                                                                onResizeStop={this.imageResize}
                                                                style={{ display: "flex" }}
                                                            >
                                                                <img src={image.link} width={image.width} height={image.height} onClick={() => { this.imageSelected(index) }} />
                                                            </Rnd>
                                                        ))}

                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                )
                            }
                            }
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default EditLogoScreen;