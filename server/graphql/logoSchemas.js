var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLBoolean = require('graphql').GraphQLBoolean;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;

var imageType = new GraphQLObjectType({
    name: 'image',
    fields: function () {
        return {
            link: {
                type: GraphQLString
            },
            x: {
                type: GraphQLInt
            },
            y: {
                type: GraphQLInt
            },
            width: {
                type: GraphQLInt
            },
            height: {
                type: GraphQLInt
            }
        }
    }
});

var textType = new GraphQLObjectType({
    name: 'text',
    fields: function () {
        return {
            text: {
                type: GraphQLString
            },
            color: {
                type: GraphQLString
            },
            fontSize: {
                type: GraphQLInt
            },
            x: {
                type: GraphQLInt
            },
            y: {
                type: GraphQLInt
            }
        }
    }
});

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            workName: {
                type: GraphQLString
            },
            images: {
                type: new GraphQLList(imageType)
            },
            texts: {
                type: new GraphQLList(textType)
            },
            backgroundColor: {
                type: GraphQLString
            },
            borderColor: {
                type: GraphQLString
            },
            borderRadius: {
                type: GraphQLInt
            },
            borderWidth: {
                type: GraphQLInt
            },
            padding: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            }
        }
    }
});


var userType = new GraphQLObjectType({
    name: 'user',
    fields: function () {
        return {
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },            
            signedIn: {
                type: GraphQLBoolean
            },
            logos: {
                type: new GraphQLList(logoType)
            }
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            users: {
                type: new GraphQLList(userType),
                resolve: function () {
                    const logos = LogoModel.find().exec()
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            user: {
                type: userType,
                args: {
                    email: {
                        name: 'email',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findOne({ 'email' : params.email}).exec()
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            },
            logo: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logoId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params){
                    return LogoModel.findOne({email: params.email}, {logos:{ $elemMatch: { '_id' : params.logoId}}});
                }
            }
        }
    }
});

var imageInput = new GraphQLInputObjectType({
    name: 'imageInput',
    fields: {
        link: { type: new GraphQLNonNull(GraphQLString) },
        x: { type: new GraphQLNonNull(GraphQLInt) },
        y: { type: new GraphQLNonNull(GraphQLInt) },
        width: { type: new GraphQLNonNull(GraphQLInt) },
        height: { type: new GraphQLNonNull(GraphQLInt) }
    }
});

var textInput = new GraphQLInputObjectType({
    name: 'textInput',
    fields: {
        text: { type: new GraphQLNonNull(GraphQLString) },
        color: { type: new GraphQLNonNull(GraphQLString) },
        fontSize: { type: new GraphQLNonNull(GraphQLInt) },
        x: { type: new GraphQLNonNull(GraphQLInt) },
        y: { type: new GraphQLNonNull(GraphQLInt) }
    }
});

var logoInput = new GraphQLInputObjectType({
    name: 'logoInput',
    fields: {
        workName: { type: new GraphQLNonNull(GraphQLString) },
        images: { type: new GraphQLNonNull(new GraphQLList(imageInput))},
        texts: { type: new GraphQLNonNull(new GraphQLList(textInput))},
        backgroundColor: { type: new GraphQLNonNull(GraphQLString) },
        borderColor: { type: new GraphQLNonNull(GraphQLString) },
        borderRadius: { type: new GraphQLNonNull(GraphQLInt) },
        borderWidth: { type: new GraphQLNonNull(GraphQLInt) },
        padding: { type: new GraphQLNonNull(GraphQLInt) },
        margin: { type: new GraphQLNonNull(GraphQLInt) }
    }
})

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addUser: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    signedIn: {
                        type: new GraphQLNonNull(GraphQLBoolean)
                    }
                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            addUserWithLogos: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logos: {
                        type: new GraphQLNonNull(new GraphQLList(logoInput))
                    }
                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            updateSignedIn: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    signedIn: {
                        type: new GraphQLNonNull(GraphQLBoolean)
                    }
                },
                resolve(root, params) {
                    return LogoModel.findOneAndUpdate({'email': params.email}, { 
                        signedIn: params.signedIn
                    }, {new: true}, (err, data) => {
                        if (err) return next(err);
                    });
                }
            },
            removeUser: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remUser = LogoModel.findOneAndRemove({'email': params.email}).exec();
                    if (!remUser) {
                        throw new Error('Error')
                    }
                    return remUser;
                }
            },
            addLogo: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logo: {
                        type: new GraphQLNonNull(logoInput)
                    }
                },
                resolve(root, params){
                    return LogoModel.findOneAndUpdate({'email': params.email}, {'$push': {'logos': params.logo}}, {new: true});
                }
            },
            removeLogo: {
                type: userType,
                args: {
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logoId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params){
                    return LogoModel.update({email: params.email}, {$pull: { logos: { '_id' : params.logoId}}}).exec();
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });