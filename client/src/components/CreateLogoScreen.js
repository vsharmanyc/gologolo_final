import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';

const ADD_LOGO = gql`
    mutation addLogo($email: String!,$logo: logoInput!){
        addLogo(email: $email, logo: $logo) {
            _id
        }
    }
`;

class CreateLogoScreen extends Component {
    constructor(props) {
        super(props);

        // WE'LL MANAGE THE UI CONTROL
        // VALUES HERE
        this.state = {
            text: "",
            color: "#000000",
            fontSize: "",
            selectedTextKey: -1,
            texts: [{
                text: "GoLogoLo Logo",
                color: "#FF0000",
                fontSize: 24,
                x: 0,
                y: 0
            }],
            imageLink: "",
            selectedImageKey: -1,
            images: [{
                link: "https://is4-ssl.mzstatic.com/image/thumb/Purple115/v4/15/59/29/15592964-85f9-e103-c628-95cd237a3067/source/256x256bb.jpg",
                x: 0,
                y: 0
            }],
            backgroundColor: "#77ffe3",
            borderColor: "#000000",
            borderRadius: 10,
            borderWidth: 5,
            padding: 5,
            margin: 5,
        }
    }

    updateLogoView = (event) => {
        console.log("update logo view");
        this.setState({ [event.target.name]: event.target.value });
    }

    textPropsChange = (event) => {
        if (this.state.selectedTextKey >= 0) {
            let textProps = this.state.texts;
            textProps[this.state.selectedTextKey][event.target.name] = event.target.value;
            this.setState({ texts: textProps, [event.target.name]: event.target.value })
        }
        else
            this.setState({ [event.target.name]: event.target.value });
        this.forceUpdate();
    }

    addText = (event) => {
        let textProps = this.state.texts;
        textProps.push({ text: this.state.text, color: this.state.color, fontSize: this.state.fontSize, x: 0, y: 0 });
        this.setState({ texts: textProps, text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
        this.forceUpdate();
    }

    deleteText = (event) => {
        let textProps = this.state.texts;
        textProps.splice(this.state.selectedTextKey, 1);
        this.setState({ texts: textProps, text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
        this.forceUpdate();
    }

    deselectText = (event) => {
        this.setState({ texts: this.state.texts.filter(text => text.text !== ""), text: "", color: "#000000", fontSize: "", selectedTextKey: -1 });
        this.forceUpdate();
    }

    textSelected(key) {
        let text = this.state.texts[key];
        this.setState({
            text: text.text,
            color: text.color,
            fontSize: text.fontSize,
            selectedTextKey: key
        });
        this.forceUpdate();
    }

    imageLinkChange = (event) => {
        if (this.state.selectedImageKey >= 0) {
            let images = this.state.images;
            images[this.state.selectedImageKey].link = event.target.value;
            this.setState({ images: images, imageLink: event.target.value })
        }
        else
            this.setState({ imageLink: event.target.value });
        this.forceUpdate();
    }

    addImage = (event) => {
        let images = this.state.images;
        images.push({ link: this.state.imageLink, x: 0, y: 0 });
        this.setState({ images: images, imageLink: "", selectedImageKey: -1 });
        this.forceUpdate();

    }

    deleteImage = (event) => {
        let images = this.state.images;
        images.splice(this.state.selectedImageKey, 1);
        this.setState({ images: images, imageLink: "", selectedImageKey: -1 });
        this.forceUpdate();
    }

    deselectImage = (event) => {
        this.setState({ images: this.state.images.filter(image => image.link !== ""), imageLink: "", selectedImageKey: -1 });
        this.forceUpdate();
    }

    imageSelected(key) {
        let image = this.state.images[key];
        this.setState({
            imageLink: image.link,
            selectedImageKey: key
        });
        this.forceUpdate();
    }


    render() {
        if (!this.props.location.others)
            this.props.history.push("/SignIn");

        let image, text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        console.log(this.state);
        return (
            <Mutation mutation={ADD_LOGO}>
                {(addLogo, { loading, error, data }) => {
                    if (data)
                        this.props.history.push(`/view/${data.addLogo._id}`);
                    return (
                        <div className="container">
                            <div className="panel panel-default">

                                <div className="row" id="work_body_container">
                                    <h4 className="container" class="home_link_container"><Link to={{
                                        pathname: '/',
                                        state: { screenName: "CreateLogoScreen" },
                                        others: { email: this.props.location.others.email }
                                    }} class="home_link">GoLogoLo Home</Link></h4>
                                    <h3 className="container">Create Logo</h3>

                                    <div className="panel-body">
                                        <form onSubmit={e => {
                                            e.preventDefault();
                                            let workName = "";
                                            this.state.texts.forEach((textObject) => { workName += textObject.text });
                                            addLogo({
                                                variables: {
                                                    email: this.props.location.others.email,
                                                    logo: {
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
                                        <div style={{
                                            backgroundColor: this.state.backgroundColor,
                                            borderColor: this.state.borderColor,
                                            borderRadius: this.state.borderRadius + "pt",
                                            borderWidth: this.state.borderWidth + "pt",
                                            borderStyle: "solid",
                                            padding: this.state.padding + "pt",
                                            margin: this.state.margin + "pt",
                                            overflow: 'auto',
                                            position: 'absolute',
                                        }}>
                                            {this.state.texts.map((text, index) => (
                                                <div key={index} onClick={() => { this.textSelected(index) }}
                                                    style={{
                                                        color: text.color,
                                                        fontSize: text.fontSize + "pt"
                                                    }}>
                                                    {text.text.replace(/\s/g, '\u00A0')}
                                                </div>
                                            ))}
                                            {this.state.images.map((image, index) => (
                                                <img key={index} src={image.link} onClick={() => { this.imageSelected(index) }} />
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    )
                }}
            </Mutation>
        );
    }
}

export default CreateLogoScreen;