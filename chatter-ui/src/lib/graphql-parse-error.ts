type GraphQLError = {
  extensions: { originalError: { message: string } };
};

const parseGqlError = (
  error:
    | {
        response: {
          errors: GraphQLError[];
        };
      }
    | unknown,
) => {
  const errorMessage = (error as { response: { errors: GraphQLError[] } })
    ?.response?.errors?.[0]?.extensions?.originalError?.message;

  return errorMessage;
};

export default parseGqlError;
