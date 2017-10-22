class Layout {
    constructor() {
        this.bounds   = {
            left  : 0,
            right : 0,
            top   : 0,
            bottom: 0,
        }
        this.size     = 1
        this.sections = []
        this.grid     = {}
    }

    addSection(left, top, right, bottom) {
        if (left > right) throw new Error('Left can not be greater than right.')
        if (top > bottom) throw new Error('Top can not be greater than Bottom.')
        this.bounds.left   = Math.min(this.bounds.left, left)
        this.bounds.top    = Math.min(this.bounds.top, top)
        this.bounds.right  = Math.max(this.bounds.right, right)
        this.bounds.bottom = Math.max(this.bounds.bottom, bottom)
        this.size          = (1 + this.bounds.right - this.bounds.left) * (1 + this.bounds.bottom - this.bounds.top)
        let section        = {
            left, top, right, bottom,
            squares: []
        }
        this.sections.push(section)
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                let square = this.grid[`${x},${y}`] || {
                    x, y,
                    sections: []
                }
                square.sections.push(section)
                section.squares.push(square)
                this.grid[`${x},${y}`] = square
            }
        }
    }

    deleteSections(x, y) {
        let square = this.square(x, y)
        while (square.sections.length) {
            let section                    = square.sections[square.sections.length - 1]
            let {left, right, top, bottom} = section
            for (let x = left; x <= right; x++) {
                for (let y = top; y <= bottom; y++) {
                    this.grid[`${x},${y}`].sections.splice(this.grid[`${x},${y}`].sections.indexOf(section), 1)
                    if (this.grid[`${x},${y}`].sections.length === 0) {
                        delete this.grid[`${x},${y}`]
                    }
                }
            }
        }
    }

    square(x, y) {
        return this.grid[`${x},${y}`]
    }

    toString() {
        let output = ""
        for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
            for (let x = this.bounds.left; x <= this.bounds.right; x++) {
                output += this.square(x, y) ? 'x' : ' '
            }
            output += '\n'
        }
        return output
    }

}

module.exports = Layout
