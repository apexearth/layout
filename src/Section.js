class Section {
    constructor({
        layout, name,
        left, top, right, bottom
    }) {

        this.layout         = layout
        this.name           = name
        this.left           = left
        this.top            = top
        this.right          = right
        this.bottom         = bottom
        this.squares        = []
        this.leftSections   = []
        this.topSections    = []
        this.rightSections  = []
        this.bottomSections = []
        this.addAllSquares({addToFront: true})
    }

    bringToFront() {
        bringToFront(this.layout.sections, this)
        this.squares.forEach(square => bringToFront(square.sections, this))
    }

    sendToBack() {
        sendToBack(this.layout.sections, this)
        this.squares.forEach(square => sendToBack(square.sections, this))
    }

    checkSquareValidity() {
        if (this.layout.overlap) return true
        for (let x = this.left; x <= this.right; x++) {
            for (let y = this.top; y <= this.bottom; y++) {
                let square = this.layout.square(x, y, true)
                if (!this.layout.overlap && square.sections.length) {
                    return false
                }
            }
        }
        return true
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

    move(x, y) {
        let differenceX = x - this.left
        let differenceY = y - this.top
        this.left += differenceX
        this.top += differenceY
        this.right += differenceX
        this.bottom += differenceY
        this.layout.updateBoundsForSection(this)
        this.removeAllSquares()
        this.addAllSquares()
    }

    addRight({name, width, height}) {
        let x      = this.right + 1
        let y      = this.top
        let ylimit = this.bottom
        while (this.layout.square(x, y) && y < ylimit) {
            y++
        }
        if (y > ylimit || this.layout.square(x, y)) throw new Error(`No space available to add ${name} to the right of ${this.name}.`)
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name)
        add(this.rightSections, section)
        add(section.leftSections, this)
        return section
    }

    addTop({name, width, height}) {
        let x      = this.left
        let y      = this.top - height
        let xlimit = this.right
        while (this.layout.square(x, y) && y < xlimit) {
            x++
        }
        if (x > xlimit || this.layout.square(x, y)) throw new Error(`No space available to add ${name} to the top of ${this.name}.`)
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name)
        add(this.topSections, section)
        add(section.bottomSections, this)
        return section
    }

    addLeft({name, width, height}) {
        let x      = this.left - width
        let y      = this.top
        let ylimit = this.bottom
        while (this.layout.square(x, y) && y < ylimit) {
            y++
        }
        if (y > ylimit || this.layout.square(x, y)) throw new Error(`No space available to add ${name} to the left of ${this.name}.`)
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name)
        add(this.leftSections, section)
        add(section.rightSections, this)
        return section
    }

    addBottom({name, width, height}) {
        let x      = this.left
        let y      = this.bottom + 1
        let xlimit = this.right
        while (this.layout.square(x, y) && y < xlimit) {
            x++
        }
        if (x > xlimit || this.layout.square(x, y)) throw new Error(`No space available to add ${name} to the bottom of ${this.name}.`)
        let section = this.layout.addSection(x, y, x + width - 1, y + height - 1, name)
        add(this.bottomSections, section)
        add(section.topSections, this)
        return section
    }
}

function bringToFront(array, object) {
    remove(array, object)
    array.unshift(object)
}

function sendToBack(array, object) {
    remove(array, object)
    array.push(object)
}

function add(array, object) {
    if (array.indexOf(object) === -1) array.push(object)
}

function remove(array, object) {
    array.splice(array.indexOf(object), 1)
}

module.exports = Section
