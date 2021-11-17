module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/airbnb',
  ],

  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'node_modules/@vue/cli-service/webpack.config',
      },
    },
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        mocha: true
      }
    },
  ],

  // add your custom rules here
  rules: {
    // override/add rules settings here, such as:
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: false,
      // ignorePropertyModificationsFor: [
      //   'state', // for vuex state
      //   'acc', // for reduce accumulators
      //   'e', // for e.return value
      // ],
    }],
    'indent': 'off',
    'indent-legacy': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': 0,
    'max-len': ['error', 120, { ignoreTrailingComments: true }],
    'vue/no-template-key': 'off',
    'object-curly-newline': ['error', { 'consistent': true }],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
    'func-names': ['error', 'never'],
  },
};
