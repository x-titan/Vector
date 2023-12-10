# Vector

XTitan_Vector is a JavaScript library for mathematical functions related to vectors.

## Usage

To use XTitan_Vector in your project, include the following script tag in your HTML file:

```html
<script scr="https://x-titan.github.io/vector/index.js" type="module" defer></script>
```

You can import various components from XTitan_Vector in your JavaScript file as follows:

```javascript
import {
  IVector,  // vector interface
  AVector,  // vector abstract class
  Vector,   // vector class
  ...       // others
} from "https://x-titan.github.io/vector/index.js"
```

## Exports


`IVector` is a interface for Vector.
`AVector` is abstract class.

```javascript
export class IVector { ... }

export class AVector extends IVector { ... }

export class Vector extends AVector { ... }

export class Vector2 extends Vector { ... }

export class Vector3 extends Vector { ... }

export const VECTOR_CONSTANTS = { ... }

export function vec (x, y, z): Vector

export function v2 (x, y): Vector2

export function v3 (x, y, z): Vector3
```

## License

This project is licensed under the [MIT License](./LICENSE).

## Contact/Support

For questions or support, you can reach out to the project maintainers:

- [XTitan](mailto:telmanov2002.at@gmail.com)

Feel free to open an issue if you encounter any problems or have suggestions for improvement.