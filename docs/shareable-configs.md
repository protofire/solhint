# Shareable Configs

Shareable configs are configurations that you can use and extend from. They can be useful for using the same base configuration in all your projects or for basing your configuration from a well-known one.

To use a shareable config, you have to add it to your Solhint configuration:

```json
{
  "extends": ["solhint:recommended", "protofire"]
}
```

This example shows the two types of shareable configs that you can use:

- **Built-in Solhint configs**, which start with `solhint:` (e.g. `solhint:recommended`, `solhint:all`)
- **Shareable configs installed from npm**


## Using npm shareable configs

Unscoped shareable configs are npm packages prefixed with `solhint-config-`.

For example, this configuration:

```json
{
  "extends": ["protofire"]
}
```

Will load the package:

```
solhint-config-protofire
```

which must be installed beforehand:

```
npm install solhint-config-protofire
```

You can also reference the full package name explicitly:

```json
{
  "extends": ["solhint-config-protofire"]
}
```

Shareable configs are resolved from the project's `node_modules` directory (the current working directory), even when Solhint is installed globally.


## Scoped shareable configs

Solhint also supports **scoped** shareable configs.

Given the npm package:

```
@scope/solhint-config-myconfig
```

You can use it in your configuration as:

```json
{
  "extends": ["@scope/solhint-config-myconfig"]
}
```

For convenience, Solhint also supports the ESLint-style shorthand:

```json
{
  "extends": ["@scope/myconfig"]
}
```

Which resolves to:

```
@scope/solhint-config-myconfig
```

Note: Only package-level scoped configs are supported (`@scope/name`). Deep paths such as `@scope/name/extra` are not supported.


## Creating your own shareable config

Shareable configs are regular npm packages. There are only two conditions:

- The package name must start with `solhint-config-`  
  (for scoped packages: `@scope/solhint-config-*`)
- The package must export a regular object with the same structure as a standard Solhint configuration (i.e. the one in your `.solhint.json`)

For example, a very minimal `index.js` in this package could be:

```js
module.exports = {
  rules: {
    'max-line-length': 80
  }
}
```

After creating this package, you can publish it to npm to make it available for everyone.


## Configuration inheritance

Solhint supports **hierarchical configuration**.

When linting a file, configurations are merged in the following order:

1. The project root configuration
2. Each parent directory configuration
3. The directory containing the file (**highest precedence**)

For each configuration file, any `extends` entries are resolved first, and then all configurations are merged according to directory hierarchy.

Rules and settings defined in deeper directories **override** those from higher-level directories and from extended configs.

In short:  
**`extends` are resolved first, directory hierarchy is applied after, and the closest config always wins.**
