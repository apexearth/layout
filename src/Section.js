class Section {
    constructor({
        layout, name,
        left, top, right, bottom,
        data = {},
        corner
    }) {
        this.layout         = layout
        this.name           = name
        this.left           = left
        this.top            = top
        this.right          = right
        this.bottom         = bottom
        this.data           = Object.assign({}, data)
        this.corner         = corner
        this.leftSections   = []
        this.topSections    = []
        this.rightSections  = []
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
        this.layout.updateBounds()
    }

    addRight({name, shift = 0, width, height, data}) {
        if (this.corner === 'top-right' || this.corner === 'bottom-right') throw new Error('Section has no right side to add to!')
        let x       = this.right + 1
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.rightSections, section)
        add(section.leftSections, this)
        return section
    }

    addTop({name, shift = 0, width, height, data}) {
        if (this.corner === 'top-left' || this.corner === 'top-right') throw new Error('Section has no top side to add to!')
        let x       = this.left + shift
        let y       = this.top - height
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.topSections, section)
        add(section.bottomSections, this)
        return section
    }

    addLeft({name, shift = 0, width, height, data}) {
        if (this.corner === 'top-left' || this.corner === 'bottom-left') throw new Error('Section has no left side to add to!')
        let x       = this.left - width
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.leftSections, section)
        add(section.rightSections, this)
        return section
    }

    addBottom({name, shift = 0, width, height, data}) {
        if (this.corner === 'bottom-left' || this.corner === 'bottom-right') throw new Error('Section has no bottom side to add to!')
        let x       = this.left + shift
        let y       = this.bottom + 1
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.bottomSections, section)
        add(section.topSections, this)
        return section
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
