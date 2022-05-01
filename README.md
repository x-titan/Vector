# Vector
## Setup
HTML
```html
<script scr="https://x-titan.github.io/vector/index.js" type="module" defer></script>
```
Javascript
```javascript
import "https://x-titan.github.io/vector/index.js"
```
## Exports
```javascript
import {
  IVector,  // vector interface
  AVector, // vector abstract class
  Vector,   // vector class
  ...            // others
} from "https://x-titan.github.io/vector/index.js"
```
```javascript
export class IVector { ... }

export class AVector extends IVector { ... }

export class Vector extends AVector { ... }

export class Vector2 extends Vector { ... }

export class Vector3 extends Vector { ... }

export const VECTOR_CONSTANTS { ... }

export function vec (x, y, z): Vector

export function v2 (x, y): Vector2

export function v3 (x, y, z): Vector3
```