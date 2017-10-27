# @apexearth/layout

A package to manage the creation and usage of layouts like two-dimensional floor plans, maps, etc, using a grid.

## Usage

```javascript
const Layout = require('@apexearth/layout')

let ship = new Layout()

let cockpit = ship.addSection(0, 0, 0, 0, 'cockpit')
expect(ship.toString()).to.equal(
    'c\n'
)

let walkway = cockpit.addBottom({
    width: 1, height: 5, name: 'walkway'
})
expect(ship.toString()).to.equal(
    'c\n' +
    'w\n' +
    'w\n' +
    'w\n' +
    'w\n' +
    'w\n'
)

walkway.addLeft({
    width: 1, height: 2, name: 'quarters'
})
walkway.addRight({
    width: 1, height: 2, name: 'quarters'
})
expect(ship.toString()).to.equal(
    ' c \n' +
    'qwq\n' +
    'qwq\n' +
    ' w \n' +
    ' w \n' +
    ' w \n'
)

let enginel = walkway.addLeft({
    width: 1, height: 3, shift: 4, name: 'engine'
})
let enginer = walkway.addRight({
    width: 1, height: 3, shift: 4, name: 'engine'
})
walkway.addBottom({
    width: 1, height: 2, name: 'cargo'
})
expect(ship.toString()).to.equal(
    ' c \n' +
    'qwq\n' +
    'qwq\n' +
    ' w \n' +
    ' w \n' +
    'ewe\n' +
    'ece\n' +
    'ece\n'
)

let generatorl = walkway.addLeft({
    width: 2, height: 2, shift: 2, name: 'generator'
})
generatorl.addLeft({
    width: 1, height: 2, shift: -1, name: 'laser'
})
generatorl.addLeft({
    width: 1, height: 2, shift: 1, name: 'shield'
})
let generatorr = walkway.addRight({
    width: 2, height: 2, shift: 2, name: 'generator'
})
generatorr.addRight({
    width: 1, height: 2, shift: -1, name: 'laser'
})
generatorr.addRight({
    width: 1, height: 2, shift: 1, name: 'shield'
})
enginel.addLeft({
    width: 1, height: 2, name: 'shield'
})
enginer.addRight({
    width: 1, height: 2, name: 'shield'
})
expect(ship.toString()).to.equal(
    '   c   \n' +
    '  qwq  \n' +
    'l qwq l\n' +
    'lggwggl\n' +
    'sggwggs\n' +
    'ssewess\n' +
    ' seces \n' +
    '  ece  \n'
)
expect(ship.size).to.equal(56)
```