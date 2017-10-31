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
    }

    get width() {
        return this.bounds.right - this.bounds.left + 1
    }

    get height() {
        return this.bounds.bottom - this.bounds.top + 1
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
        for (let sectionIndex = this.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
            let section = this.sections[sectionIndex]
            if (section.left <= x && section.right >= x && section.top <= y && section.bottom >= y) {
                this.deleteSection(section)
            }
        }
    }

    deleteSection(section) {
        this.sections.splice(this.sections.indexOf(section), 1)
        section._remove()
        this.updateBounds()
    }

    removeSection(section) {
        return this.deleteSection(section)
    }

    toString() {
        let output = ""
        for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
            for (let x = this.bounds.left; x <= this.bounds.right; x++) {
                let printedSection = false
                for (let sectionIndex = this.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
                    let section = this.sections[sectionIndex]
                    if (section.left <= x && section.right >= x && section.top <= y && section.bottom >= y) {
                        let {name} = section
                        output += name ? name[0] : 'x'
                        printedSection = true
                        break
                    }
                }
                if (!printedSection) {
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