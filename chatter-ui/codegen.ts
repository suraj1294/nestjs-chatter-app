import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: `${process.env.VITE_API_URL}/graphql`,
  documents: 'src/**/*.(tsx|ts)',
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
    },
  },
};

export default config;
