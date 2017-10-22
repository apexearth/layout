class Layout {
    constructor({autoShrink = true} = {}) {
        this.autoShrink = autoShrink
        this.bounds     = {
            left  : undefined,
            right : undefined,
            top   : undefined,
            bottom: undefined,
        }
        this.size       = 0
        this.sections   = []
        this.grid       = {}
    }

    updateBounds() {
        if (this.autoShrink || this.size === 0) {
            if (this.sections.length) {
                this.bounds.left   = Number.MAX_SAFE_INTEGER
                this.bounds.right  = Number.MIN_SAFE_INTEGER
                this.bounds.top    = Number.MAX_SAFE_INTEGER
                this.bounds.bottom = Number.MIN_SAFE_INTEGER
            } else {
                this.bounds.left   = undefined
                this.bounds.right  = undefined
                this.bounds.top    = undefined
                this.bounds.bottom = undefined
                this.size          = 0
            }
        }
        this.sections.forEach(section => this.updateBoundsForSection(section))
    }

    updateBoundsForSection({left, right, top, bottom}) {
        this.bounds.left   = Math.min(this.bounds.left, left)
        this.bounds.top    = Math.min(this.bounds.top, top)
        this.bounds.right  = Math.max(this.bounds.right, right)
        this.bounds.bottom = Math.max(this.bounds.bottom, bottom)
        this.size          = (1 + this.bounds.right - this.bounds.left) * (1 + this.bounds.bottom - this.bounds.top)
    }

    addSection(left, top, right, bottom) {
        if (left > right) throw new Error('Left can not be greater than right.')
        if (top > bottom) throw new Error('Top can not be greater than Bottom.')
        let section = {
            left, top, right, bottom,
            squares: []
        }
        this.sections.push(section)
        this.updateBounds(section)
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

    deleteAllSections() {
        while (this.sections.length) {
            let section = this.sections[this.sections.length - 1]
            this.deleteSection(section)
        }
    }

    deleteSections(x, y) {
        let square = this.square(x, y)
        while (square.sections.length) {
            let section = square.sections[square.sections.length - 1]
            this.deleteSection(section)
        }
    }

    deleteSection(section) {
        let {left, right, top, bottom} = section
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                this.grid[`${x},${y}`].sections.splice(this.grid[`${x},${y}`].sections.indexOf(section), 1)
                if (this.grid[`${x},${y}`].sections.length === 0) {
                    delete this.grid[`${x},${y}`]
                }
            }
        }
        this.sections.splice(this.sections.indexOf(section), 1)
        this.updateBounds()
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
