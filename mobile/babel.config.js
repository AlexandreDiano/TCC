module.exports = function (api) {
  api.cache(true);
  const plugins = [
    [
      'module:react-native-dotenv',
      {
        "moduleName": "@env",
        "path": ".env",
        "blacklist": null,
        "whitelist": null,
        "safe": false,
        "allowUndefined": true
      }
    ],
    'react-native-reanimated/plugin'
  ];

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
