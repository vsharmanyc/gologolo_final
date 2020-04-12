import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';

const ADD_LOGO = gql`
    mutation AddLogo(
        $text: String!,
        $color: String!,
        $fontSize: Int!,
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderWidth: Int!,
        $padding: Int!,
        $margin: Int!) {
        addLogo(
            text: $text,
            color: $color,
            fontSize: $fontSize,
            backgroundColor: $backgroundColor,
            borderColor: $borderColor,
            borderRadius: $borderRadius,
            borderWidth: $borderWidth,
            padding: $padding,
            margin: $margin) {
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
            text: "GoLogoLo Logo",
            isValidText: true,
            color: "#FF0000",
            fontSize: 24,
            backgroundColor: "#77ffe3",
            borderColor: "black",
            borderRadius: 10,
            borderWidth: 5,
            padding: 5,
            margin: 5
        }
    }

    updateLogoView = (event) => {
        console.log("update logo view");
        this.setState({ [event.target.name]: event.target.value });
    }



    render() {
        let text, color, fontSize, backgroundColor, borderColor, borderRadius, borderWidth, padding, margin;
        return (
            <Mutation mutation={ADD_LOGO}>
                {(addLogo, { loading, error, data }) => {
                    if (data)
                        this.props.history.push(`/view/${data.addLogo._id}`);
                    return (
                        <div className="container">
                            <div className="panel panel-default">

                                <div className="row" id="work_body_container">
                                    <h4 className="container" class="home_link_container"><Link to="/" class="home_link">GoLogoLo Home</Link></h4>
                                    <h3 className="container">Create Logo</h3>

                                    <div className="panel-body">
                                        <form onSubmit={e => {
                                            e.preventDefault();
                                            addLogo({
                                                variables: {
                                                    text: text.value,
                                                    color: color.value,
                                                    fontSize: parseInt(fontSize.value),
                                                    backgroundColor: backgroundColor.value,
                                                    borderColor: borderColor.value,
                                                    borderRadius: parseInt(borderRadius.value),
                                                    borderWidth: parseInt(borderWidth.value),
                                                    padding: parseInt(padding.value),
                                                    margin: parseInt(margin.value)
                                                }
                                            });
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
                                                <div className="form-group">
                                                    <label htmlFor="text">Text:</label>
                                                    <input type="text" className="form-control" name="text" ref={node => {
                                                        text = node;
                                                    }} placeholder="Text" defaultValue={this.state.text} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="color">Color:</label>
                                                    <input type="color" className="form-control" name="color" ref={node => {
                                                        color = node;
                                                    }} placeholder="Color" defaultValue={this.state.color} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="fontSize">Font Size:</label>
                                                    <input type="number" className="form-control" name="fontSize" min="0" max="144" ref={node => {
                                                        fontSize = node;
                                                    }} placeholder="Font Size" defaultValue={this.state.fontSize} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="backgroundColor">Background Color:</label>
                                                    <input type="color" className="form-control" name="backgroundColor" ref={node => {
                                                        backgroundColor = node;
                                                    }} placeholder="Background Color" defaultValue={this.state.backgroundColor} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderColor">Border Color:</label>
                                                    <input type="color" className="form-control" name="borderColor" ref={node => {
                                                        borderColor = node;
                                                    }} placeholder="Border Color" defaultValue={this.state.borderColor} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderRadius">Border Radius:</label>
                                                    <input type="number" className="form-control" name="borderRadius" min="0" ref={node => {
                                                        borderRadius = node;
                                                    }} placeholder="Border Radius" defaultValue={this.state.borderRadius} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="borderWidth">Border Width:</label>
                                                    <input type="number" className="form-control" name="borderWidth" min="0" ref={node => {
                                                        borderWidth = node;
                                                    }} placeholder="Border Width" defaultValue={this.state.borderWidth} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="padding">Padding:</label>
                                                    <input type="number" className="form-control" name="padding" min="0" ref={node => {
                                                        padding = node;
                                                    }} placeholder="Padding" defaultValue={this.state.padding} onChange={this.updateLogoView} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="margin">Margin:</label>
                                                    <input type="number" className="form-control" name="margin" min="0" ref={node => {
                                                        margin = node;
                                                    }} placeholder="Margin" defaultValue={this.state.margin} onChange={this.updateLogoView} />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-success">Submit</button>
                                        </form>
                                        {loading && <p>Loading...</p>}
                                        {error && <p>Error :( Please try again</p>}
                                    </div>

                                    <div className="col s8">
                                        <div style={{
                                            color: this.state.color,
                                            fontSize: this.state.fontSize + "pt",
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
                                            {this.state.text.replace(/\s/g, '\u00A0')}
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