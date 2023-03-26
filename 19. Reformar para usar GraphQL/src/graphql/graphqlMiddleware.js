import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

import {
  getProducts,
  getProductId,
  postProduct,
  putProduct,
  delProduct,
} from '../controllers/productsGraphqlController.js'

const schema = buildSchema(`
  input ProductInput {
    title: String
    price: String
    thumbnail: String
  }
  type Product {
    _id: ID!
    title: String!
    price: String!
    thumbnail: String!
  }
  type Query {
    getProductId(id: ID!): Product
    getProducts(campo: String, valor: String): [Product]
  }
  
  type Mutation {
    postProduct(datos: ProductInput!): Product
    putProduct(id: ID!, datos: ProductInput!): Product
    delProduct(id: ID!): Product
  }
`)

export const graphqlMiddleware = graphqlHTTP({
  schema,
  rootValue: {
    getProducts,
    getProductId,
    postProduct,
    putProduct,
    delProduct,
  },
  graphiql: true,
})