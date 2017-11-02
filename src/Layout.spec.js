const {expect}          = require('chai')
const Layout            = require('./Layout')

describe('Layout', function () {

    it('defaults', () => {
        let layout = new Layout()
        layout.addSection(-1, -1, 1, 2)
        expect(layout.autoShrink).to.equal(true)
        expect(layout.overlap).to.equal(false)
        expect(layout.bounds).to.exist
        expect(layout.size).to.equal(12)
        expect(layout.sections).to.exist
        expect(layout.width).to.equal(3)
        expect(layout.height).to.equal(4)
    })

    it('.updateBounds()', () => {
        let layout = new Layout({autoShrink: false})
        layout.sections.push({
            left: 1, top: 1, bottom: 2, right: 2
        })
        layout.updateBounds()
        expect(layout.size).to.equal(4)
        expect(layout.bounds).to.deep.equal({
            left: 1, top: 1, bottom: 2, right: 2
        })

        layout.sections.push({
            left: -1, top: 0, bottom: 2, right: 2
        })
        layout.updateBounds()
        expect(layout.size).to.equal(12)
        expect(layout.bounds).to.deep.equal({
            left: -1, top: 0, bottom: 2, right: 2
        })

        layout.sections.splice(0)
        layout.updateBounds()
        expect(layout.size).to.equal(12)
        expect(layout.bounds).to.deep.equal({
            left: -1, top: 0, bottom: 2, right: 2
        })

        layout.autoShrink = true
        layout.updateBounds()
        expect(layout.size).to.equal(0)
        expect(layout.bounds).to.deep.equal({
            left  : undefined,
            right : undefined,
            top   : undefined,
            bottom: undefined,
        })
    })
    it('.updateBoundsForSection()', () => {
        let layout = new Layout()

        // Only works if these are set as is done in .updateBounds().
        layout.bounds.left   = Number.MAX_SAFE_INTEGER
        layout.bounds.right  = Number.MIN_SAFE_INTEGER
        layout.bounds.top    = Number.MAX_SAFE_INTEGER
        layout.bounds.bottom = Number.MIN_SAFE_INTEGER

        let section = {
            left: 1, top: 1, bottom: 2, right: 2
        }
        layout.updateBoundsForSection(section)
        expect(layout.size).to.equal(4)
        expect(layout.bounds).to.deep.equal({
            left: 1, top: 1, bottom: 2, right: 2
        })
    })
    it('.add()', () => {
        let layout  = new Layout()
        let section = layout.add({left: 1, right: 5, top: 1, bottom: 5, name: 'pop', data: {test: 42}})
        expect(section.name).to.equal('pop')
        expect(section.left).to.equal(1)
        expect(section.top).to.equal(1)
        expect(section.right).to.equal(5)
        expect(section.bottom).to.equal(5)
        expect(layout.size).to.equal(25)
        expect(layout.bounds).to.deep.equal({
            left: 1, top: 1, bottom: 5, right: 5
        })
        expect(section.data.test).to.equal(42)
    })
    it('.addSection()', () => {
        let layout   = new Layout()
        let section1 = layout.addSection(0, 0, 0, 0, 'a', {test: 1})
        let section2 = layout.addSection(1, 0, 1, 0, 'b', {test: 2})
        expect(layout.size).to.equal(2)
        expect(layout.bounds).to.deep.equal({
            left: 0, top: 0, right: 1, bottom: 0
        })
        expect(layout.toString()).to.equal(
            'ab\n'
        )
        expect(section1.data.test).to.equal(1)
        expect(section2.data.test).to.equal(2)
        layout.removeSection(section1)
        layout.removeSection(section2)
    })
    it('.deleteSection()', () => {
        let layout   = new Layout()
        let section1 = layout.addSection(0, 0, 0, 0, 'a')
        let section2 = layout.addSection(1, 0, 1, 0, 'b')
        layout.deleteSection(section1)
        expect(layout.toString()).to.equal(
            'b\n'
        )
        let left   = section2.addLeft({width: 1, height: 1})
        let top    = section2.addTop({width: 1, height: 1})
        let right  = section2.addRight({width: 1, height: 1})
        let bottom = section2.addBottom({width: 1, height: 1})
        layout.deleteSection(section2)

        // All adjacent section information should have section2 removed.
        expect(section2.leftSections.length).to.equal(0)
        expect(section2.topSections.length).to.equal(0)
        expect(section2.rightSections.length).to.equal(0)
        expect(section2.bottomSections.length).to.equal(0)
        expect(left.rightSections.length).to.equal(0)
        expect(top.bottomSections.length).to.equal(0)
        expect(right.leftSections.length).to.equal(0)
        expect(bottom.topSections.length).to.equal(0)
    })
    it('.removeSection()', () => {
        let layout   = new Layout()
        let section1 = layout.addSection(0, 0, 0, 0, 'a')
        let section2 = layout.addSection(1, 0, 1, 0, 'b')
        layout.removeSection(section1)
        expect(layout.toString()).to.equal(
            'b\n'
        )
    })
    it('.deleteSections()', () => {
        let layout = new Layout()
        layout.addSection(0, 0, 0, 0, 'a')
        let section = layout.addSection(1, 0, 1, 0, 'b')
        layout.deleteSections(0, 0)
        expect(layout.sections.length).to.equal(1)
        expect(layout.sections[0]).to.equal(section)
    })
    it('.deleteAllSections()', () => {
        let layout = new Layout()
        layout.addSection(0, 0, 0, 0, 'a')
        layout.addSection(1, 0, 1, 0, 'b')
        layout.deleteAllSections()
        expect(layout.sections.length).to.equal(0)
    })

    describe('usage', () => {
        it('autoShrink: false', () => {
            let layout = new Layout({autoShrink: false})
            layout.addSection(3, 3, 3, 6)
            layout.deleteAllSections()
            expect(layout.size).to.equal(4)
            expect(layout.bounds).to.deep.equal({
                left: 3, top: 3, right: 3, bottom: 6
            })
            expect(layout.toString()).to.equal(
                ' \n' +
                ' \n' +
                ' \n' +
                ' \n'
            )
            layout.addSection(1, 3, 1, 6)
            expect(layout.size).to.equal(12)
            expect(layout.bounds).to.deep.equal({
                left: 1, top: 3, right: 3, bottom: 6
            })
            expect(layout.toString()).to.equal(
                'x  \n' +
                'x  \n' +
                'x  \n' +
                'x  \n'
            )
        })
        it('section names, bringToFront, sendToBack, move', () => {
            let layout = new Layout({overlap: true, autoShrink: false})
            layout.addSection(0, 0, 0, 0, 'box')
            expect(layout.sections[0].name).to.equal('box')
            expect(layout.toString()).to.equal(
                'b\n'
            )
            layout.addSection(-1, -1, 1, 1, 'wrapper')
            expect(layout.sections.length).to.equal(2)
            expect(layout.toString()).to.equal(
                'www\n' +
                'www\n' +
                'www\n'
            )
            layout.sections[0].bringToFront()
            expect(layout.sections.length).to.equal(2)
            expect(layout.toString()).to.equal(
                'www\n' +
                'wbw\n' +
                'www\n'
            )
            layout.sections[1].sendToBack()
            expect(layout.sections.length).to.equal(2)
            expect(layout.toString()).to.equal(
                'www\n' +
                'www\n' +
                'www\n'
            )
            layout.sections[1].sendToBack()
            expect(layout.sections.length).to.equal(2)
            layout.sections[0].move(0, -1)
            expect(layout.toString()).to.equal(
                ' www\n' +
                ' bww\n' +
                ' www\n'
            )
            layout.sections[1].move(-1, 0)
            expect(layout.toString()).to.equal(
                ' www\n' +
                'bwww\n' +
                ' www\n'
            )
        })
        it('basics', function () {
            let layout = new Layout({overlap: true})

            layout.addSection(0, 0, 2, 2)
            expect(layout.bounds).to.deep.equal({
                left: 0, top: 0, right: 2, bottom: 2
            })

            layout.addSection(-2, -2, 0, 0)
            expect(layout.bounds).to.deep.equal({
                left: -2, top: -2, right: 2, bottom: 2
            })

            // Left is greater than right should throw.
            expect(() => {
                layout.addSection(2, 2, 0, 2)
            }).to.throw()

            // Top is greater than bottom should throw.
            expect(() => {
                layout.addSection(2, 2, 2, 0)
            }).to.throw()

            /**
             * The image is actually based on connectors.
             * A 1 by 1 section shows 2 by 2 x's because each corner is a connector.
             */
            layout = new Layout({overlap: true})
            layout.addSection(-1, -1, 1, 1)
            expect(layout.toString()).to.equal(
                'xxx\n' +
                'xxx\n' +
                'xxx\n'
            )
            expect(layout.size).to.equal(9)
            expect(layout.bounds).to.deep.equal({
                left: -1, top: -1, right: 1, bottom: 1
            })

            layout.addSection(-2, 0, 2, 0)
            expect(layout.size).to.equal(15)
            expect(layout.bounds).to.deep.equal({
                left: -2, top: -1, right: 2, bottom: 1
            })
            expect(layout.toString()).to.equal(
                ' xxx \n' +
                'xxxxx\n' +
                ' xxx \n'
            )

            layout.addSection(3, 3, 3, 6)
            expect(layout.size).to.equal(48)
            expect(layout.bounds).to.deep.equal({
                left: -2, top: -1, right: 3, bottom: 6
            })
            expect(layout.toString()).to.equal(
                ' xxx  \n' +
                'xxxxx \n' +
                ' xxx  \n' +
                '      \n' +
                '     x\n' +
                '     x\n' +
                '     x\n' +
                '     x\n'
            )

            layout.deleteSections(0, 0) // Delete sections overlapping this location
            expect(layout.size).to.equal(4)
            expect(layout.bounds).to.deep.equal({
                left: 3, top: 3, right: 3, bottom: 6
            })
            expect(layout.toString()).to.equal(
                'x\n' +
                'x\n' +
                'x\n' +
                'x\n'
            )

            layout.deleteAllSections()
            expect(layout.size).to.equal(0)
            expect(layout.bounds).to.deep.equal({
                left: undefined, top: undefined, right: undefined, bottom: undefined
            })
            expect(layout.toString()).to.equal(
                ''
            )
        })
    })
    describe("practical applications", () => {
        it('tv room layout', () => {
            let room = new Layout({overlap: true})
            room.addSection(0, 0, 10, 10, 'floor')
            room.addSection(3, 0, 7, 1, 'couch')
            room.addSection(0, 0, 1, 1, 'lamp')
            room.addSection(9, 0, 10, 1, 'lamp')
            room.addSection(3, 4, 7, 6, 'table')
            room.addSection(4, 5, 4, 5, 'coffee')
            room.addSection(2, 9, 8, 10, 'television')
            room.addSection(0, 10, 0, 10, 'speaker')
            room.addSection(10, 10, 10, 10, 'speaker')
            room.addSection(0, 0, 0, 0, 'speaker')
            room.addSection(10, 0, 10, 0, 'speaker')
            expect(room.toString()).to.equal(
                'slfcccccfls\n' +
                'llfcccccfll\n' +
                'fffffffffff\n' +
                'fffffffffff\n' +
                'ffftttttfff\n' +
                'ffftctttfff\n' +
                'ffftttttfff\n' +
                'fffffffffff\n' +
                'fffffffffff\n' +
                'fftttttttff\n' +
                'sftttttttfs\n'
            )
        })
        it('one floor home, using add directions', () => {
            let home       = new Layout()
            let livingRoom = home.add({
                name  : 'Living Room',
                width : 5,
                height: 5
            })
            let hallway    = livingRoom
                .addRight({
                    name  : 'Hallway',
                    width : 1,
                    height: 5
                })
            expect(livingRoom.rightSections.length).to.equal(1)
            expect(livingRoom.rightSections[0]).to.equal(hallway)
            expect(hallway.leftSections.length).to.equal(1)
            expect(hallway.leftSections[0]).to.equal(livingRoom)
            let bathroom1 = hallway.addRight({
                name  : 'Bathroom',
                width : 2,
                height: 2
            })
            expect(hallway.rightSections.length).to.equal(1)
            expect(hallway.rightSections[0]).to.equal(bathroom1)
            expect(bathroom1.leftSections.length).to.equal(1)
            expect(bathroom1.leftSections[0]).to.equal(hallway)
            let bedRoom = hallway.addTop({
                name  : 'Bedroom',
                width : 5,
                height: 4,
            })
            expect(hallway.topSections.length).to.equal(1)
            expect(hallway.topSections[0]).to.equal(bedRoom)
            expect(bedRoom.bottomSections.length).to.equal(1)
            expect(bedRoom.bottomSections[0]).to.equal(hallway)
            let bathroom2 = bedRoom.addLeft({
                name  : 'Bathroom',
                width : 2,
                height: 2
            })
            expect(bedRoom.leftSections.length).to.equal(1)
            expect(bedRoom.leftSections[0]).to.equal(bathroom2)
            expect(bathroom2.rightSections.length).to.equal(1)
            expect(bathroom2.rightSections[0]).to.equal(bedRoom)
            let kitchen = hallway.addRight({
                name  : 'Kitchen',
                shift : 2,
                width : 4,
                height: 4
            })
            expect(hallway.rightSections.length).to.equal(2)
            expect(hallway.rightSections[1]).to.equal(kitchen)
            expect(kitchen.leftSections.length).to.equal(1)
            expect(kitchen.leftSections[0]).to.equal(hallway)
            let frontDoor = hallway.addBottom({
                name  : 'Front Door',
                width : 1,
                height: 1
            })
            expect(frontDoor.topSections.length).to.equal(1)
            expect(frontDoor.topSections[0]).to.equal(hallway)
            expect(hallway.bottomSections.length).to.equal(1)
            expect(hallway.bottomSections[0]).to.equal(frontDoor)
            expect(home.toString()).to.equal(
                '   BBBBBBB\n' +
                '   BBBBBBB\n' +
                '     BBBBB\n' +
                '     BBBBB\n' +
                'LLLLLHBB  \n' +
                'LLLLLHBB  \n' +
                'LLLLLHKKKK\n' +
                'LLLLLHKKKK\n' +
                'LLLLLHKKKK\n' +
                '     FKKKK\n'
            )
            livingRoom.shift(0, 1)
            hallway.addLeft({
                name  : 'Study',
                shift : -2,
                width : 5,
                height: 3
            })
            expect(home.toString()).to.equal(
                '   BBBBBBB\n' +
                '   BBBBBBB\n' +
                'SSSSSBBBBB\n' +
                'SSSSSBBBBB\n' +
                'SSSSSHBB  \n' +
                'LLLLLHBB  \n' +
                'LLLLLHKKKK\n' +
                'LLLLLHKKKK\n' +
                'LLLLLHKKKK\n' +
                'LLLLLFKKKK\n'
            )
        })
        it('starship!', () => {
            let ship = new Layout()

            let cockpit = ship.addSection(0, 0, 0, 0, 'cockpit')
            expect(ship.toString()).to.equal(
                'c\n'
            )

            let walkway = cockpit.addBottom({
                width: 1, height: 5, name: 'walkway'
            })
            expect(ship.toString()).to.equal(
                'c\n' +
                'w\n' +
                'w\n' +
                'w\n' +
                'w\n' +
                'w\n'
            )

            walkway.addLeft({
                width: 1, height: 2, name: 'quarters'
            })
            walkway.addRight({
                width: 1, height: 2, name: 'quarters'
            })
            expect(ship.toString()).to.equal(
                ' c \n' +
                'qwq\n' +
                'qwq\n' +
                ' w \n' +
                ' w \n' +
                ' w \n'
            )

            let enginel = walkway.addLeft({
                width: 1, height: 3, shift: 4, name: 'engine'
            })
            let enginer = walkway.addRight({
                width: 1, height: 3, shift: 4, name: 'engine'
            })
            walkway.addBottom({
                width: 1, height: 2, name: 'cargo'
            })
            expect(ship.toString()).to.equal(
                ' c \n' +
                'qwq\n' +
                'qwq\n' +
                ' w \n' +
                ' w \n' +
                'ewe\n' +
                'ece\n' +
                'ece\n'
            )

            let generatorl = walkway.addLeft({
                width: 2, height: 2, shift: 2, name: 'generator'
            })
            generatorl.addLeft({
                width: 1, height: 2, shift: -1, name: 'laser'
            })
            generatorl.addLeft({
                width: 1, height: 2, shift: 1, name: 'shield'
            })
            let generatorr = walkway.addRight({
                width: 2, height: 2, shift: 2, name: 'generator'
            })
            generatorr.addRight({
                width: 1, height: 2, shift: -1, name: 'laser'
            })
            generatorr.addRight({
                width: 1, height: 2, shift: 1, name: 'shield'
            })
            enginel.addLeft({
                width: 1, height: 2, name: 'shield'
            })
            enginer.addRight({
                width: 1, height: 2, name: 'shield'
            })
            expect(ship.toString()).to.equal(
                '   c   \n' +
                '  qwq  \n' +
                'l qwq l\n' +
                'lggwggl\n' +
                'sggwggs\n' +
                'ssewess\n' +
                ' seces \n' +
                '  ece  \n'
            )
            expect(ship.size).to.equal(56)
        })
    })

})