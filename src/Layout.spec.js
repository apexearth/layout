const coverage = require('./test-coverage')
const {expect} = require('chai')
const Layout   = require('./Layout')

describe('Layout', function () {
    coverage(this, new Layout())

    it('basics', () => {
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

        expect(layout.square(0, 0).x).to.equal(0)
        expect(layout.square(0, 0).y).to.equal(0)
        expect(layout.square(1, 1).x).to.equal(1)
        expect(layout.square(1, 1).y).to.equal(1)
        expect(layout.square(10, 10)).to.equal(undefined)

        expect(layout.square(0, 0).sections.length).to.equal(2)
        expect(layout.square(0, 1).sections.length).to.equal(1)
        expect(layout.square(0, -1).sections.length).to.equal(1)
        expect(layout.square(0, -1).sections[0]).to.not.equal(layout.square(0, 1).sections[0])

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
        let layout = new Layout({overlap: true})
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
        layout.sections[1].bringToFront()
        expect(layout.sections.length).to.equal(2)
        expect(layout.toString()).to.equal(
            'www\n' +
            'wbw\n' +
            'www\n'
        )
        layout.sections[0].sendToBack()
        expect(layout.sections.length).to.equal(2)
        expect(layout.toString()).to.equal(
            'www\n' +
            'www\n' +
            'www\n'
        )
        layout.sections[0].sendToBack()
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
    })

})