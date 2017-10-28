const Section = require('./Section')

class Layout {
    constructor({
        autoShrink = true,
        overlap = false
    } = {}) {
        this.autoShrink = autoShrink
        this.overlap    = overlap
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

    get width() {
        return this.bounds.right - this.bounds.left + 1
    }

    get height() {
        return this.bounds.bottom - this.bounds.top + 1
    }

    forEachSquare(fn) {
        const {left, right, top, bottom} = this.bounds
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                let square = this.square(x, y)
                if (square) {
                    if (fn(square) === false) return false
                }
            }
        }
        return true
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

    addSection(left, top, right, bottom, name, data) {
        if (left > right) throw new Error('Left can not be greater than right.')
        if (top > bottom) throw new Error('Top can not be greater than Bottom.')
        let section = new Section({
            layout: this,
            name,
            left, top, right, bottom,
            data
        })
        this.sections.push(section)
        this.updateBounds(section)
        return section
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
        section._remove()
        this.updateBounds()
    }

    removeSection(section) {
        return this.deleteSection(section)
    }

    square(x, y, create) {
        if (create) {
            return this.grid[`${x},${y}`] || (this.grid[`${x},${y}`] = {
                layout  : this,
                x, y,
                sections: [],
                remove() {
                    delete this.layout.grid[`${x},${y}`]
                }
            })
        } else {
            return this.grid[`${x},${y}`]
        }
    }

    toString() {
        let output = ""
        for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
            for (let x = this.bounds.left; x <= this.bounds.right; x++) {
                let square = this.square(x, y)
                if (square) {
                    let name = square.sections[square.sections.length - 1].name
                    output += name ? name[0] : 'x'
                } else {
                    output += ' '
                }
            }
            output += '\n'
        }
        return output
    }

    add({left, top, right, bottom, x, y, width, height, name, data}) {
        left   = left || (x || 0)
        right  = right || ((x || 0) + width - 1)
        top    = top || (y || 0)
        bottom = bottom || ((y || 0) + height - 1)
        return this.addSection(left, top, right, bottom, name, data)
    }
}

module.exports = Layout