const express = require('express')
const { buildSchema } = require('graphql')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const Sequelize = require('sequelize')

// Search-query definition
// Note: There's a special `right - left` index defined on the database
const SQL_SEARCH_NODES = `
  (
    SELECT
      *
    FROM
      operam.image_net_node
    WHERE
      "right" - "left" > 1
    ORDER BY
      "left" ASC
  )

  UNION ALL

  (
    SELECT
      *
    FROM
      operam.image_net_node
    WHERE
      "right" - "left" = 1
      AND "name" ILIKE $1
    ORDER BY
      "left" ASC
  )

  ORDER BY
    "left" ASC
`

/*
 * Sequelize instantiation
 * TODO: Use environment variables
 */
const sequelize = new Sequelize('pali', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  schema: 'operam',
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

/*
 * Relation(s) definition
 * TODO: Move to a separate file
 */
const ImageNetNode = sequelize.define('image_net_node', {
  id: {
    type: Sequelize.NUMERIC,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  nameNested: {
    type: Sequelize.STRING
  },
  left: {
    type: Sequelize.NUMERIC
  },
  right: {
    type: Sequelize.NUMERIC
  },
  size: {
    type: Sequelize.NUMERIC
  }
}, {
  timestamps: false
});

/*
 * Helper function(s)
 * TODO: Move to a separate file
 */
function cleanResponseTree(tree) {
  return {
    id: tree.id,
    name: tree.name,
    nameNested: tree.nameNested,
    size: tree.size,
    children: tree.children.map(cleanResponseTree)
  }
}

/*
 * GraphQL
 */
const schema = buildSchema(`
  type Query {
    treeFlatJson(search: String): String
  }
`)

// Root resolver
const root = {
  treeFlatJson: async params => {
    const searchValue = params.search
    let tree = undefined
    let lastNode = undefined

    // Fetch data
    const nodes = searchValue
      ? sequelize.query(SQL_SEARCH_NODES, {type: sequelize.QueryTypes.SELECT, bind: ['%' + searchValue + '%']})
      : ImageNetNode.findAll({order: [['left', 'ASC']]})

    // Build a tree (transformation from flat structure to a tree)
    return nodes.then(nodes => {
      nodes.forEach(node => {
        node = node.dataValues || node
  
        // Top-level node
        if (!tree) {
          tree = {
            children: [],
            ...node
          }
          lastNode = tree
          return
        }
  
        // Go back to a higher level
        if (node.left > lastNode.right) {
          while (node.left > lastNode.right) {
            lastNode = lastNode.parent
          }
        }
  
        // Add node into the tree
        node.parent = lastNode
        node.children = []
        lastNode.children.push(node)
        lastNode = node
      })
  
      // Return tree
      return JSON.stringify(cleanResponseTree(tree))
    })
  } 
}

/*
 * ExpressJS
 */
const app = express()
app.use(cors())

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}))

app.listen(4000, () => console.log('Listening on localhost:4000')) // TODO: Define port as an environment variable
