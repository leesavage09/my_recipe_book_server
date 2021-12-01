const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const graphql = require("graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;
const recipeScraper = require("recipe-scraper");
const cors = require('cors');

const RecipeTimings = new GraphQLObjectType({
    name: 'RecipeTimings',
    discription: 'Recipe Timings JSON',
    fields: {
        prep: {
            type: GraphQLString
        },

        cook: {
            type: GraphQLString
        },

        active: {
            type: GraphQLString
        },
        inactive: {
            type: GraphQLString
        },
        ready: {
            type: GraphQLString
        },
        total: {
            type: GraphQLString
        }
    }
})

const RecipeType = new GraphQLObjectType({
    name: 'Recipe',
    discription: 'Recipe JSON',
    fields: {
        name: {
            type: GraphQLString
        },
        ingredients: {
            type: graphql.GraphQLList(GraphQLString)
        },
        instructions: {
            type: graphql.GraphQLList(GraphQLString)
        },
        tags: {
            type: graphql.GraphQLList(GraphQLString)
        },
        servings: {
            type: GraphQLString
        },
        image: {
            type: GraphQLString
        },
        time: {
            type: RecipeTimings
        }
    }
})

const rootQuery = new GraphQLObjectType({
    name: "rootQuery",
    description: "the root query",
    fields: {
        recipe: {
            type: RecipeType,
            args: {
                url: { type: GraphQLString }
            },
            resolve: (_, { url }) => {
                return recipeScraper(url);
            }
        }
    }
})

const schema = new GraphQLSchema({ query: rootQuery })

const app = express()

app.use('/graphql', cors({
    origin: 'http://localhost:8000',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}), graphqlHTTP({
    schema: schema,
    graphiql: true
}))

const PORT = 3001

// app.use(cors({
//     origin: 'http://localhost:8000',
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
// }));

app.listen(PORT, () => {
    console.log("GraphQL Server Running")
})