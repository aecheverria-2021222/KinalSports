import reactNative from "eslint-plugin-react-native";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    plugins: {
      "react-native": reactNative,
    },
    rules: {
      "react-native/no-unused-styles": 2,
      "react-native/split-platform-components": 2,
      "react-native/no-inline-styles": 1,
      "react-native/no-color-literals": 2,
      "react-native/no-raw-text": 2,
    },
    languageOptions: {
      globals: {
        require: true,
        module: true,
        __dirname: true,
        console: true,
        fetch: true,
        setTimeout: true,
        clearTimeout: true,
        setInterval: true,
        clearInterval: true,
        FormData: true,
        alert: true,
      },
      parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
      },
    },
  },
];
