class Section {
    constructor({
        layout, name, left, top, right, bottom
    }) {

        this.layout  = layout
        this.name    = name
        this.left    = left
        this.top     = top
        this.right   = right
        this.bottom  = bottom
        this.squares = []
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

    addAllSquares({addToFront = false} = {}) {
        let sectionIndex = this.layout.sections.indexOf(this)
        for (let x = this.left; x <= this.right; x++) {
            for (let y = this.top; y <= this.bottom; y++) {
                let square = this.layout.square(x, y, true)
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
        let x = this.right + 1
        let y = this.top - height + 1

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

function remove(array, object) {
    array.splice(array.indexOf(object), 1)
}

module.exports = Section
