import write from 'write'
import { getIntrospectionQuery, graphql, printSchema } from 'gatsby/graphql'

/**
 * Generate GraphQL schema.json file to be read by eslint
 * Thanks: https://gist.github.com/kkemple/6169e8dc16369b7c01ad7408fc7917a9
 * (via:https://github.com/damassi/gatsby-starter-typescript-rebass-netlifycms/blob/master/gatsby-node.js)
 */
exports.onPostBootstrap = async ({ store }) => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const introspectionQuery = getIntrospectionQuery()
      const { schema } = store.getState()
      const jsonSchema = await graphql(schema, introspectionQuery)
      const sdlSchema = printSchema(schema)

      write.sync('schema.json', JSON.stringify(jsonSchema.data), {})
      write.sync('schema.graphql', sdlSchema, {})

      console.log('\n\n[gatsby-plugin-extract-schema] Wrote schema\n') // eslint-disable-line
    } catch (error) {
      console.error(
        '\n\n[gatsby-plugin-extract-schema] Failed to write schema: ',
        error,
        '\n',
      )
    }
  }
}
