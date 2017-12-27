/**
 * The Section class.
 */
class Section {
    constructor({
        layout, name,
        left, top, right, bottom,
        data = {},
        corner
    }) {
        /** @type {Layout} */
        this.layout = layout
        /** @type {string} */
        this.name = name
        /** @type {number} */
        this.left = left
        /** @type {number} */
        this.top = top
        /** @type {number} */
        this.right = right
        /** @type {number} */
        this.bottom = bottom
        /** @type {*} */
        this.data = Object.assign({}, data)
        /**  @type {'top-left'|'top-right'|'bottom-right'|'bottom-left'|undefined} */
        this.corner = corner
        /** @type {Array} */
        this.leftSections = []
        /** @type {Array} */
        this.topSections = []
        /** @type {Array} */
        this.rightSections = []
        /** @type {Array} */
        this.bottomSections = []
        this.validate()
    }

    get width() {
        return this.right - this.left + 1
    }

    get height() {
        return this.bottom - this.top + 1
    }

    bringToFront() {
        bringToFront(this.layout.sections, this)
    }

    sendToBack() {
        sendToBack(this.layout.sections, this)
    }

    _remove() {
        this.leftSections.forEach(section => remove(section.rightSections, this))
        this.leftSections.splice(0)
        this.rightSections.forEach(section => remove(section.leftSections, this))
        this.rightSections.splice(0)
        this.topSections.forEach(section => remove(section.bottomSections, this))
        this.topSections.splice(0)
        this.bottomSections.forEach(section => remove(section.topSections, this))
        this.bottomSections.splice(0)
    }

    remove() {
        this.layout.removeSection(this)
    }

    shift(x, y) {
        return this.move(this.left + x, this.top + y)
    }

    move(x, y) {
        let differenceX = x - this.left
        let differenceY = y - this.top
        this.left += differenceX
        this.top += differenceY
        this.right += differenceX
        this.bottom += differenceY
        this.layout._updateBounds()
    }

    addRight({name, shift = 0, width, height, data, corner}) {
        if (this.corner === 'top-right' || this.corner === 'bottom-right') throw new Error('Section has no right side to add to!')
        let x       = this.right + 1
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data, corner)
        add(this.rightSections, section)
        add(section.leftSections, this)
        return section
    }

    addTop({name, shift = 0, width, height, data, corner}) {
        if (this.corner === 'top-left' || this.corner === 'top-right') throw new Error('Section has no top side to add to!')
        let x       = this.left + shift
        let y       = this.top - height
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data, corner)
        add(this.topSections, section)
        add(section.bottomSections, this)
        return section
    }

    addLeft({name, shift = 0, width, height, data, corner}) {
        if (this.corner === 'top-left' || this.corner === 'bottom-left') throw new Error('Section has no left side to add to!')
        let x       = this.left - width
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data, corner)
        add(this.leftSections, section)
        add(section.rightSections, this)
        return section
    }

    addBottom({name, shift = 0, width, height, data, corner}) {
        if (this.corner === 'bottom-left' || this.corner === 'bottom-right') throw new Error('Section has no bottom side to add to!')
        let x       = this.left + shift
        let y       = this.bottom + 1
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data, corner)
        add(this.bottomSections, section)
        add(section.topSections, this)
        return section
    }

    resize(left, top, right, bottom) {
        const overlap = this.layout.sections.filter(section =>
            left < section.left ||
            top < section.top ||
            right > section.right ||
            bottom > section.bottom
        ).length
        if (overlap) {
            throw new Error('Cannot resize section due to overlap.')
        } else {
            this.left   = left
            this.top    = top
            this.right  = right
            this.bottom = bottom
        }
    }

    validate() {
        if (this.corner) {
            if (this.corner !== 'top-left' &&
                this.corner !== 'top-right' &&
                this.corner !== 'bottom-left' &&
                this.corner !== 'bottom-right') {
                throw new Error(`${this.corner} is an invalid corner.`)
            }
        }
        if (!this.layout.overlap) {
            const overlap = this.layout.sections.filter(section =>
                section !== this &&
                !(
                    this.left < section.left ||
                    this.top < section.top ||
                    this.right > section.right ||
                    this.bottom > section.bottom
                )
            ).length
            if (overlap) {
                throw new Error('Section is invalid due to overlap.')
            }
        }
    }
}

function bringToFront(array, object) {
    remove(array, object)
    array.push(object)
}

function sendToBack(array, object) {
    remove(array, object)
    array.unshift(object)
}

function add(array, object) {
    if (array.indexOf(object) === -1) array.push(object)
}

function remove(array, object) {
    array.splice(array.indexOf(object), 1)
}

module.exports = Section
