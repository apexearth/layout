class Section {
    constructor({
        layout, name,
        left, top, right, bottom,
        data = {}
    }) {

        this.layout         = layout
        this.name           = name
        this.left           = left
        this.top            = top
        this.right          = right
        this.bottom         = bottom
        this.data           = Object.assign({}, data)
        this.squares        = []
        this.leftSections   = []
        this.topSections    = []
        this.rightSections  = []
        this.bottomSections = []
        this.addAllSquares({addToFront: true})
    }

    get width() {
        return this.right - this.left + 1
    }

    get height() {
        return this.bottom - this.top + 1
    }

    bringToFront() {
        bringToFront(this.layout.sections, this)
        this.squares.forEach(square => bringToFront(square.sections, this))
    }

    sendToBack() {
        sendToBack(this.layout.sections, this)
        this.squares.forEach(square => sendToBack(square.sections, this))
    }

    addAllSquares({addToFront = false} = {}) {
        let sectionIndex = this.layout.sections.indexOf(this)
        for (let x = this.left; x <= this.right; x++) {
            for (let y = this.top; y <= this.bottom; y++) {
                let square = this.layout.square(x, y, true)
                if (!this.layout.overlap && square.sections.length) {
                    throw new Error(`Cannot add ${this.name} due to overlap with ${square.sections[0].name}.`)
                }
                if (!addToFront) {
                    let insertionIndex = 0
                    for (; insertionIndex < square.sections.length; insertionIndex++) {
                        if (this.layout.sections.indexOf(square.sections[insertionIndex]) > sectionIndex) {
                            break
                        }
                    }
                    square.sections.splice(insertionIndex, 0, this)
                } else {
                    square.sections.push(this)
                }

                this.squares.push(square)

            }
        }
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

    removeAllSquares() {
        while (this.squares.length) {
            let square = this.squares[this.squares.length - 1]
            remove(square.sections, this)
            remove(this.squares, square)
            if (!square.sections.length) {
                square.remove()
            }
        }
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
        this.removeAllSquares()
        this.addAllSquares()
    }

    addRight({name, shift = 0, width, height, data}) {
        let x       = this.right + 1
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.rightSections, section)
        add(section.leftSections, this)
        return section
    }

    addTop({name, shift = 0, width, height, data}) {
        let x       = this.left + shift
        let y       = this.top - height
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.topSections, section)
        add(section.bottomSections, this)
        return section
    }

    addLeft({name, shift = 0, width, height, data}) {
        let x       = this.left - width
        let y       = this.top + shift
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.leftSections, section)
        add(section.rightSections, this)
        return section
    }

    addBottom({name, shift = 0, width, height, data}) {
        let x       = this.left + shift
        let y       = this.bottom + 1
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name, data)
        add(this.bottomSections, section)
        add(section.topSections, this)
        return section
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
