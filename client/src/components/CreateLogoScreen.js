import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';
import Draggable, { DraggableCore } from 'react-draggable';
import { Resizable, ResizableBox } from 'react-resizable';
import { Rnd } from 'react-rnd';

const ADD_LOGO = gql`
    mutation addLogo($email: String!,$logo: logoInput!){
        addLogo(email: $email, logo: $logo) {
            logos{
                _id
            }
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
                x: 100,
                y: 100,
                height: 200,
                width: 200
            }],
            backgroundColor: "#77ffe3",
            borderColor: "#000000",
            borderRadius: 10,
            borderWidth: 5,
            padding: 5,
            margin: 5,
            width: 500,
            height: 500,
            disableDrag: "false"
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
        textProps.push({ text: this.state.text, color: this.state.color, fontSize: parseInt(this.state.fontSize), x: 0, y: 0 });
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

    textDragStopped = (event) => {
        if (this.state.selectedTextKey !== -1) {
            let texts = this.state.texts;
            texts[this.state.selectedTextKey].x = event.x;
            texts[this.state.selectedTextKey].y = event.y;
            this.setState({ texts: texts });
        }
    }

    imageDrag = (event, d) => {
        if (this.state.selectedImageKey !== -1) {
            let images = this.state.images;
            images[this.state.selectedImageKey].x = d.x;
            images[this.state.selectedImageKey].y = d.y;
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

    onResize = (event, { element, size, handle }) => {
        this.setState({ width: size.width, height: size.height });
    }


    render() {
        let email = localStorage.getItem('signedInUser');
        if (!email)
            this.props.history.push("/SignIn");

        let image, text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        console.log(this.state);
        return (
            <Mutation mutation={ADD_LOGO}>
                {(addLogo, { loading, error, data }) => {
                    if (data) {
                        console.log(data);
                        this.props.history.push({
                            pathname: `/view/${data.addLogo.logos[data.addLogo.logos.length - 1]._id}`,
                            state: { screenName: "HomeScreen" },
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
                                    <h3 className="container">Create Logo</h3>

                                    <div className="panel-body">
                                        <form onSubmit={e => {
                                            e.preventDefault();
                                            let workName = "";
                                            this.state.texts.forEach((textObject) => { workName += textObject.text });
                                            addLogo({
                                                variables: {
                                                    email: email,
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

                                    <div className="col s8" style={{display: "flex"}}>
                                        <Resizable className="box" height={this.state.height} width={this.state.width} onResize={this.onResize} resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
                                            <div className="box" style={{
                                                backgroundColor: this.state.backgroundColor,
                                                borderColor: this.state.borderColor,
                                                borderRadius: this.state.borderRadius + "pt",
                                                borderWidth: this.state.borderWidth + "pt",
                                                borderStyle: "solid",
                                                padding: this.state.padding + "pt",
                                                margin: this.state.margin + "pt",
                                                height: this.state.height + "px",
                                                width: this.state.width + "px",
                                                position: 'absolute',
                                            }}>
                                                {this.state.texts.map((text, index) => (
                                                    <Draggable bounds="parent" onStop={this.textDragStopped}>
                                                        <div key={index} onClick={() => { this.textSelected(index) }}
                                                            style={{
                                                                color: text.color,
                                                                fontSize: text.fontSize + "pt",
                                                                display: "inline-block"
                                                            }}>
                                                            {text.text.replace(/\s/g, '\u00A0')}
                                                        </div></Draggable>
                                                ))}

                                                {/**this.state.images.map((image, index) => (
                                                    <Draggable bounds="parent" disabled={this.disableDrag} onStart={() => { this.imageSelected(index) }} onStop={this.imageDragStopped} >
                                                        <Resizable className="box" height={image.height} width={image.width} onResize={(event, { element, size, handle }) => {
                                                            let images = this.state.images;
                                                            images[index].width = size.width;
                                                            images[index].height = size.height;
                                                            this.setState({ images: images, selectedImageKey: index, disableDrag: "true" });
                                                            this.imageSelected(index);
                                                        }} onResizeStart={(e) => { this.setState({ disableDrag: "true" }); this.imageSelected(index); }} onResizeStop={(e) => { this.setState({ disableDrag: "false" }) }}
                                                            resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}>
                                                            <div className="box" style={{ display: "inline-block" }}>

                                                                <img key={index} src={image.link} width={image.width} height={image.height} onClick={() => { this.imageSelected(index) }} />

                                                            </div>
                                                        </Resizable></Draggable>
                                                    ))*/}
                                                {this.state.images.map((image, index) => (
                                                    <Rnd
                                                        bounds= '.col'
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
                                                        style={{display: "flex"}}
                                                    >
                                                        <img src={image.link} width={image.width} heigth={image.height} onClick={() => { this.imageSelected(index) }} />
                                                    </Rnd>
                                                ))}
                                            </div>
                                        </Resizable>
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