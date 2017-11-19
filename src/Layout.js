const Section = require('./Section')
const assert  = require("assert")

/**
 * Class used to create layouts.
 */
class Layout {
    /**
     * @param autoShrink - Whether to automatically shrink the Layout bounds when possible.
     * @param overlap - Whether to allow Sections to overlap each other.
     */
    constructor({
        autoShrink = true,
        overlap = false
    } = {}) {
        this.autoShrink = autoShrink
        this.overlap    = overlap

        /**
         * The bounds of the Layout.
         * @type {{left: number, right: number, top: number, bottom: number}}
         */
        this.bounds = {
            left  : undefined,
            right : undefined,
            top   : undefined,
            bottom: undefined,
        }

        /**
         * The total area of the Layout. (width * height)
         * @type {number}
         */
        this.size = 0

        /**
         * The sections within the Layout.
         * @type {Array}
         */
        this.sections = []
    }

    /**
     * The width of the Layout.
     * @returns {number}
     */
    get width() {
        return this.bounds.right - this.bounds.left + 1
    }

    /**
     * The height of the Layout.
     * @returns {number}
     */
    get height() {
        return this.bounds.bottom - this.bounds.top + 1
    }

    /**
     * Update the bounds of the Layout based on the Sections within.
     * @private
     */
    _updateBounds() {
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
        this.sections.forEach(section => this._updateBoundsForSection(section))
    }

    /**
     * Update the bounds of the Layout using a Section.
     * @param section {Section}
     * @private
     */
    _updateBoundsForSection({left, right, top, bottom}) {
        this.bounds.left   = Math.min(this.bounds.left, left)
        this.bounds.top    = Math.min(this.bounds.top, top)
        this.bounds.right  = Math.max(this.bounds.right, right)
        this.bounds.bottom = Math.max(this.bounds.bottom, bottom)
        this.size          = (1 + this.bounds.right - this.bounds.left) * (1 + this.bounds.bottom - this.bounds.top)
    }

    /**
     * Add a section to the Layout.
     * @param left {number} - The left bound.
     * @param top {number} - The top bound.
     * @param right {number} - The right bound.
     * @param bottom {number} - The bottom bound.
     * @param name {string} - The name of the Section.
     * @param data {object} - The data to associate with the section.
     * @param corner {'top-left'|'top-right'|'bottom-right'|'bottom-left'|undefined} - Whether the section is a corner.
     * @returns {Section}
     */
    addSection(left, top, right, bottom, name, data, corner) {
        if (left > right) throw new Error('Left can not be greater than right.')
        if (top > bottom) throw new Error('Top can not be greater than Bottom.')
        let section = new Section({
            layout: this,
            name,
            left, top, right, bottom,
            data,
            corner
        })
        this.sections.push(section)
        this._updateBounds(section)
        return section
    }

    /**
     * Delete all sections within the Layout.
     */
    deleteAllSections() {
        while (this.sections.length) {
            let section = this.sections[this.sections.length - 1]
            this.deleteSection(section)
        }
    }

    /**
     * Delete sections located at coordinates.
     * @param x {number}
     * @param y {number}
     */
    deleteSections(x, y) {
        for (let sectionIndex = this.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
            let section = this.sections[sectionIndex]
            if (section.left <= x && section.right >= x && section.top <= y && section.bottom >= y) {
                this.deleteSection(section)
            }
        }
    }

    /**
     * Delete a specific section.
     * @param section - The section to delete from the Layout.
     * @returns {Section}
     */
    deleteSection(section) {
        this.sections.splice(this.sections.indexOf(section), 1)
        section._remove()
        this._updateBounds()
        return section
    }

    /**
     * Same as deleteSection.
     * @param section - The section to delete from the Layout.
     * @returns {Section}
     */
    removeSection(section) {
        return this.deleteSection(section)
    }

    /**
     * Get all sections at a coordinate.
     * @param x {number}
     * @param y {number}
     */
    sectionsAt(x, y) {
        assert.ok(typeof x === 'number', 'x must be a number')
        assert.ok(typeof y === 'number', 'y must be a number')
        return this.sections.filter(section => !(
            section.left > x ||
            section.right < x ||
            section.top > y ||
            section.bottom < y
        ))
    }

    /**
     * Create an ASCII representation of the Layout.
     * @returns {string}
     */
    toString() {
        let output = ""
        for (let y = this.bounds.top; y <= this.bounds.bottom; y++) {
            for (let x = this.bounds.left; x <= this.bounds.right; x++) {
                let printedSection = false
                for (let sectionIndex = this.sections.length - 1; sectionIndex >= 0; sectionIndex--) {
                    let section = this.sections[sectionIndex]
                    if (section.left <= x && section.right >= x && section.top <= y && section.bottom >= y) {
                        let {name}     = section
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

    /**
     * Add a section to the Layout using more flexible options.
     * @param left - The left bound.
     * @param top - The top bound.
     * @param right - The right bound.
     * @param bottom - The bottom bound.
     * @param x - The left bound.
     * @param y - The right bound.
     * @param width - The right bound, minus x.
     * @param height - The bottom bound, minus y.
     * @param corner {'top-left'|'top-right'|'bottom-right'|'bottom-left'|undefined} - Whether the section is a corner.
     * @param name - The name of the Section.
     * @param data - The data to associate with the Section.
     * @returns {Section} - The Section added.
     */
    add({
        left, top, right, bottom,
        x, y, width, height,
        corner,
        name, data
    }) {
        left   = left || (x || 0)
        right  = right || ((x || 0) + width - 1)
        top    = top || (y || 0)
        bottom = bottom || ((y || 0) + height - 1)
        return this.addSection(left, top, right, bottom, name, data, corner)
    }
}

module.exports = Layout