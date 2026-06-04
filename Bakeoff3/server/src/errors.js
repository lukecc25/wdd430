import { GraphQLError } from 'graphql';

export function gqlError(message, code = 'BAD_REQUEST') {
  throw new GraphQLError(message, {
    extensions: { code },
  });
}
