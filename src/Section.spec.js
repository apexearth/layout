const {expect} = require('chai')
const Layout   = require('./Layout')
const Section  = require('./Section')

describe('Section', function () {
    it('new Section()', () => {
        let data    = {test: 1}
        let layout  = new Layout()
        let section = layout.addSection(1, 2, 3, 5, 'hello', data, 'bottom-left')
        expect(section.layout).to.equal(layout)
        expect(section.name).to.equal('hello')
        expect(section.left).to.equal(1)
        expect(section.top).to.equal(2)
        expect(section.right).to.equal(3)
        expect(section.bottom).to.equal(5)
        expect(section.width).to.equal(3)
        expect(section.height).to.equal(4)
        expect(section.data).to.deep.equal(data)
        expect(section.corner).to.equal('bottom-left')
        expect(section.leftSections).to.deep.equal([])
        expect(section.topSections).to.deep.equal([])
        expect(section.rightSections).to.deep.equal([])
        expect(section.bottomSections).to.deep.equal([])
    })
    it('.bringToFront()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(1, 2, 3, 4)
        let section2 = layout.addSection(1, 2, 3, 4)
        expect(layout.sections[1] === section2).to.equal(true)
        section1.bringToFront()
        expect(layout.sections[1] === section1).to.equal(true)
    })
    it('.sendToBack()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(1, 2, 3, 4)
        let section2 = layout.addSection(1, 2, 3, 4)
        expect(layout.sections[1] === section2).to.equal(true)
        section2.sendToBack()
        expect(layout.sections[1] === section1).to.equal(true)
    })
    it('.remove()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(1, 2, 3, 4)
        let section2 = layout.addSection(1, 2, 3, 4)
        expect(layout.sections[1] === section2).to.equal(true)
        section2.sendToBack()
        expect(layout.sections[1] === section1).to.equal(true)
        section1.remove()
        expect(layout.sections[0] === section2).to.equal(true)
        expect(layout.sections.length).to.equal(1)
    })
    it('.shift()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(1, 2, 3, 4)
        section1.shift(1, 0)
        expect(section1.left).to.equal(2)
        expect(section1.top).to.equal(2)
        expect(section1.right).to.equal(4)
        expect(section1.bottom).to.equal(4)
        expect(layout.bounds.left).to.equal(2)
        expect(layout.bounds.top).to.equal(2)
        expect(layout.bounds.right).to.equal(4)
        expect(layout.bounds.bottom).to.equal(4)
    })
    it('.move()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(1, 2, 3, 4)
        section1.move(2, 2)
        expect(section1.left).to.equal(2)
        expect(section1.top).to.equal(2)
        expect(section1.right).to.equal(4)
        expect(section1.bottom).to.equal(4)
        expect(layout.bounds.left).to.equal(2)
        expect(layout.bounds.top).to.equal(2)
        expect(layout.bounds.right).to.equal(4)
        expect(layout.bounds.bottom).to.equal(4)
    })
    it('.addLeft()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(0, 0, 0, 0)
        let section2 = section1.addLeft({
            width: 2, height: 1, name: 'left21', data: {hi: 'hello21'}
        })
        expect(section2.left).to.equal(-2)
        expect(section2.top).to.equal(0)
        expect(section2.right).to.equal(-1)
        expect(section2.bottom).to.equal(0)
        expect(section2.data).to.deep.equal({
            hi: 'hello21'
        })
        expect(section2.name).to.equal('left21')
        expect(section2.rightSections).to.deep.equal([section1])
        expect(section1.leftSections).to.deep.equal([section2])

        layout      = new Layout()
        let topLeft = layout.add({
            left: 0, right: 0, top: 0, bottom: 0, corner: 'bottom-right'
        })
        expect(() => {
            topLeft.addRight({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addBottom({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addLeft({width: 1, height: 1})
            topLeft.addTop({width: 1, height: 1})
        }).to.not.throw()
    })
    it('.addRight()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(0, 0, 0, 0)
        let section2 = section1.addRight({
            width: 2, height: 1, name: 'right23', data: {wakka: 'dakka'}
        })
        expect(section2.left).to.equal(1)
        expect(section2.top).to.equal(0)
        expect(section2.right).to.equal(2)
        expect(section2.bottom).to.equal(0)
        expect(section2.data).to.deep.equal({
            wakka: 'dakka'
        })
        expect(section2.name).to.equal('right23')
        expect(section1.rightSections).to.deep.equal([section2])
        expect(section2.leftSections).to.deep.equal([section1])

        layout      = new Layout()
        let topLeft = layout.add({
            left: 0, right: 0, top: 0, bottom: 0, corner: 'bottom-left'
        })
        expect(() => {
            topLeft.addLeft({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addBottom({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addRight({width: 1, height: 1})
            topLeft.addTop({width: 1, height: 1})
        }).to.not.throw()
    })
    it('.addTop()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(0, 0, 0, 0)
        let section2 = section1.addTop({
            width: 1, height: 2, name: 'toppie', data: {wakka: 'dakka2'}
        })
        expect(section2.left).to.equal(0)
        expect(section2.top).to.equal(-2)
        expect(section2.right).to.equal(0)
        expect(section2.bottom).to.equal(-1)
        expect(section2.data).to.deep.equal({
            wakka: 'dakka2'
        })
        expect(section2.name).to.equal('toppie')
        expect(section2.bottomSections).to.deep.equal([section1])
        expect(section1.topSections).to.deep.equal([section2])

        layout      = new Layout()
        let topLeft = layout.add({
            left: 0, right: 0, top: 0, bottom: 0, corner: 'top-left'
        })
        expect(() => {
            topLeft.addLeft({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addTop({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addRight({width: 1, height: 1})
            topLeft.addBottom({width: 1, height: 1})
        }).to.not.throw()
    })
    it('.addBottom()', () => {
        let layout   = new Layout({overlap: true})
        let section1 = layout.addSection(0, 0, 0, 0)
        let section2 = section1.addBottom({
            width: 1, height: 2, name: 'bottle', data: {wakko: 'dakko'}
        })
        expect(section2.left).to.equal(0)
        expect(section2.top).to.equal(1)
        expect(section2.right).to.equal(0)
        expect(section2.bottom).to.equal(2)
        expect(section2.data).to.deep.equal({
            wakko: 'dakko'
        })
        expect(section2.name).to.equal('bottle')
        expect(section1.bottomSections).to.deep.equal([section2])
        expect(section2.topSections).to.deep.equal([section1])

        layout      = new Layout()
        let topLeft = layout.add({
            left: 0, right: 0, top: 0, bottom: 0, corner: 'top-right'
        })
        expect(() => {
            topLeft.addRight({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addTop({width: 1, height: 1})
        }).to.throw()
        expect(() => {
            topLeft.addLeft({width: 1, height: 1})
            topLeft.addBottom({width: 1, height: 1})
        }).to.not.throw()
    })
    it('.validate()', () => {
        expect(() => {
            new Section({
                corner: 'bottom-top'
            })
        }).to.throw()
    })
})