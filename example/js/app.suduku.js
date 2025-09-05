import * as Paperless from './lib.paperless.js';
import * as Foundation from './lib.foundation.js';
import { getSudoku } from './extlib/sudukugen-1.0.2.min.js';

class Square extends Paperless.Component {
    constructor(attributes = {}) {
        super(attributes);
        this._placeholder = attributes.placeholder;
        this.generate();
    }
    generate() {
        if (this._placeholder == '-' || this._placeholder == '--') {
            let count = 1;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const label = new Paperless.Drawables.Label({
                        context: this.context,
                        layer: 5,
                        point: { x: this.x - 21 + 37.5 + (j * 20), y: this.y - 16 + 37.5 + (i * 20) },
                        autosize: true,
                        content: String(count++),
                        fillcolor: '#815556',
                        font: '20px CPMono-v07-Light',
                        alpha: 0.2,
                        sticky: true
                    });
                    this.enroll(label);
                    this.enroll(new Paperless.Controls.Button({
                        context: this.context,
                        layer: 5,
                        movable: false,
                        focusable: false,
                        drawable: label,
                        onLeftClick: (self) => {
                            this.context.getLayer(5).unfreeze();
                            if (self.drawable.alpha == 0.2) {
                                self.drawable.alpha = 1;
                                self.drawable.fillcolor = '#815556';
                                self.drawable.generate();
                            }
                            else {
                                self.drawable.alpha = 0.2;
                                self.drawable.fillcolor = '#815556';
                                self.drawable.generate();
                            }
                            this.context.getLayer(5).freeze();
                        },
                        onRightClick: (self) => {
                            this.context.getLayer(5).unfreeze();
                            if (self.drawable.alpha == 0.2) {
                                self.drawable.alpha = 1;
                                self.drawable.fillcolor = '#436665';
                                self.drawable.generate();
                            }
                            else {
                                self.drawable.alpha = 0.2;
                                self.drawable.fillcolor = '#815556';
                                self.drawable.generate();
                            }
                            this.context.getLayer(5).freeze();
                        },
                    }));
                }
            }
            if (this._placeholder == '-') {
                const rectangle = new Paperless.Drawables.Rectangle({
                    context: this.context,
                    layer: 0,
                    point: { x: this.x + 37.5, y: this.y + 37.5 },
                    size: { width: 75, height: 75 },
                    nostroke: true,
                    hoverable: false,
                    fillcolor: '#151515',
                    alpha: 0
                });
                this._highlight = new Paperless.Control({
                    context: this.context,
                    layer: 0,
                    movable: false,
                    drawable: rectangle,
                    onFocus: (self) => {
                        self.drawable.alpha = 1;
                        this.context.refresh();
                    },
                    onLostFocus: (self) => {
                        self.drawable.alpha = 0;
                        this.context.refresh();
                    },
                });
                this.enroll(rectangle);
                this.enroll(this._highlight);
            }
        }
        else {
            this.enroll(new Paperless.Drawables.Label({
                context: this.context,
                layer: 2,
                point: { x: this.x + 37.5, y: this.y + 37.5 },
                size: { width: 75, height: 75 },
                fillcolor: ' #436665',
                font: '46px CPMono-v07-Light',
                padding: { top: 2 },
                autosize: true,
                hoverable: false,
                content: this._placeholder
            }));
        }
    }
    add(number) {
        if (this._placed)
            this.context.detach(this._placed.guid);
        this._placed = new Paperless.Drawables.Label({
            context: this.context,
            layer: 6,
            point: { x: this.x + 37.5, y: this.y + 37.5 },
            size: { width: 75, height: 75 },
            fillcolor: ' #436665',
            font: '46px CPMono-v07-Light',
            padding: { top: 2 },
            autosize: true,
            hoverable: false,
            content: number
        });
        this.enroll(this._placed);
        this.context.refresh();
    }
    remove() {
        if (this._placed) {
            this.context.detach(this._placed.guid);
            this.context.refresh();
        }
    }
    onDetach() {
        this.detachEnrolled();
    }
    get highlight() {
        return this._highlight;
    }
}

class Grid extends Paperless.Component {
    constructor(attributes = {}) {
        super(attributes);
        this._squares = [];
        this._puzzle = attributes.puzzle;
        this.generate();
    }
    generate() {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            this.enroll(new Square({
                context: this.context,
                layer: 5,
                point: { x: this.x + 700, y: this.y + (i * 75) + 100 },
                placeholder: '--',
            }));
        }
        for (let i = 0; i < 9; i++) {
            this.enroll(new Square({
                context: this.context,
                layer: 5,
                point: { x: this.x + (i * 75), y: this.y },
                placeholder: '--',
            }));
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const square = new Square({
                    context: this.context,
                    layer: this._puzzle[count] == '-' ? 5 : 2,
                    point: { x: this.x + (j * 75), y: this.y + (i * 75) + 100 },
                    placeholder: this._puzzle[count],
                });
                this.enroll(square);
                if (this._puzzle[count] == '-')
                    this._squares.push(square);
                else
                    this._squares.push(null);
                count++;
            }
        }
        this.enroll(new Paperless.Drawables.Rectangle({
            context: this.context,
            layer: 2,
            point: { x: this.x + 337.5, y: this.y + 437.5 },
            size: { width: 675, height: 675 },
            strokecolor: '#815556',
            nofill: true,
            hoverable: false,
            linewidth: 5
        }));
        this.enroll(new Paperless.Drawables.Line({
            context: this.context,
            layer: 2,
            point0: { x: this.x, y: this.y + 325 },
            point1: { x: this.x + 675, y: this.y + 325 },
            strokecolor: '#815556',
            linewidth: 5,
            hoverable: false,
        }));
        this.enroll(new Paperless.Drawables.Line({
            context: this.context,
            layer: 2,
            point0: { x: this.x, y: this.y + 550 },
            point1: { x: this.x + 675, y: this.y + 550 },
            strokecolor: '#815556',
            linewidth: 5,
            hoverable: false,
        }));
        this.enroll(new Paperless.Drawables.Line({
            context: this.context,
            layer: 2,
            point0: { x: this.x + 225, y: this.y + 100 },
            point1: { x: this.x + 225, y: this.y + 775 },
            strokecolor: '#815556',
            linewidth: 5,
            hoverable: false,
        }));
        this.enroll(new Paperless.Drawables.Line({
            context: this.context,
            layer: 2,
            point0: { x: this.x + 450, y: this.y + 100 },
            point1: { x: this.x + 450, y: this.y + 775 },
            strokecolor: '#815556',
            linewidth: 5,
            hoverable: false,
        }));
        for (let i = 0; i < 8; i++) {
            if (i != 2 && i != 5) {
                this.enroll(new Paperless.Drawables.Line({
                    context: this.context,
                    layer: 2,
                    point0: { x: this.x + 75 + (i * 75), y: this.y + 100 },
                    point1: { x: this.x + 75 + (i * 75), y: this.y + 775 },
                    strokecolor: '#815556',
                    linewidth: 1,
                    hoverable: false,
                    alpha: 0.3,
                }));
                this.enroll(new Paperless.Drawables.Line({
                    context: this.context,
                    layer: 2,
                    point0: { x: this.x, y: this.y + 175 + (i * 75) },
                    point1: { x: this.x + 675, y: this.y + 175 + (i * 75) },
                    strokecolor: '#815556',
                    linewidth: 1,
                    hoverable: false,
                    alpha: 0.3,
                }));
            }
        }
    }
    onDetach() {
        this.detachEnrolled();
        this._squares = [];
    }
    get squares() {
        return this._squares;
    }
}

class Button extends Paperless.Component {
    constructor(attributes = {}) {
        super(attributes);
        this._content = attributes.content;
        this._fillcolor = attributes.fillcolor;
        this._onLeftClick = attributes.onLeftClick;
        this.generate();
    }
    generate() {
        const rectangle = new Paperless.Drawables.Rectangle({
            context: this.context,
            point: { x: this.x + 65, y: this.y + 13 },
            size: { width: 130, height: 26 },
            nostroke: true,
            fillcolor: this._fillcolor
        });
        this.enroll(rectangle);
        this.enroll(new Paperless.Drawables.Label({
            context: this.context,
            matrix: rectangle.matrix,
            autosize: true,
            fillcolor: '#151515',
            font: '20px CPMono-v07-Light',
            content: this._content,
            padding: { top: 1 },
        }));
        this.enroll(new Paperless.Controls.Button({
            context: this.context,
            drawable: rectangle,
            movable: false,
            focusable: false,
            onLeftClick: this._onLeftClick ? this._onLeftClick : null,
            onInside: () => {
                rectangle.shadowcolor = rectangle.fillcolor;
                rectangle.shadow = 5;
            },
            onOutside: () => {
                rectangle.shadow = 0;
            }
        }));
    }
    onDetach() {
        this.detachEnrolled();
    }
    get content() {
        return this._content;
    }
}

class Suduku {
    constructor() {
        this._difficulty = 'easy';
        this._element = document.createElement('textarea');
        this._keyboard = new Foundation.Keyboard(this._element, this);
        this._context = new Paperless.Context({
            autosize: true,
            layer: 0,
        });
        this._context.attach(document.body);
        new Button({
            context: this._context,
            point: { x: ((window.innerWidth - 800) / 2), y: ((window.innerHeight - 826) / 2) + 800 },
            content: 'new',
            fillcolor: '#436665',
            onLeftClick: () => {
                this._context.getLayer(2).unfreeze();
                this._context.getLayer(5).unfreeze();
                this._context.detach(this._grid.guid);
                this.new();
                this._context.getLayer(2).freeze();
                this._context.getLayer(5).freeze();
            }
        });
        new Button({
            context: this._context,
            layer: 1,
            point: { x: ((window.innerWidth - 800) / 2) + 135, y: ((window.innerHeight - 826) / 2) + 800 },
            content: 'easy',
            fillcolor: '#815556',
            onLeftClick: () => {
                this.switch('easy');
            }
        });
        new Button({
            context: this._context,
            layer: 1,
            point: { x: ((window.innerWidth - 800) / 2) + 270, y: ((window.innerHeight - 826) / 2) + 800 },
            content: 'medium',
            fillcolor: '#060606',
            onLeftClick: () => {
                this.switch('medium');
            }
        });
        new Button({
            context: this._context,
            layer: 1,
            point: { x: ((window.innerWidth - 800) / 2) + 405, y: ((window.innerHeight - 826) / 2) + 800 },
            content: 'hard',
            fillcolor: '#060606',
            onLeftClick: () => {
                this.switch('hard');
            }
        });
        new Button({
            context: this._context,
            layer: 1,
            point: { x: ((window.innerWidth - 800) / 2) + 540, y: ((window.innerHeight - 826) / 2) + 800 },
            content: 'expert',
            fillcolor: '#060606',
            onLeftClick: () => {
                this.switch('expert');
            }
        });
        new Paperless.MouseAction({
            context: this._context,
            onMouseMove: () => {
                const x = Math.floor((this._context.states.pointer.current.x - this._grid.x) / 75);
                const y = Math.floor((this._context.states.pointer.current.y - this._grid.y - 100) / 75);
                const target = x + (y * 9);
                if (x >= 0 && y >= 0 && x <= 8 && y <= 8 && target <= 80 && this._grid.squares[target])
                    this._context.setFocus(this._grid.squares[target].highlight.guid);
                else
                    this._context.removeFocus();
            }
        });
        this._keyboard.setKeydownCallbacks(new Map([
            ['key', [this.onKey]],
            ['delete', [this.onDelete]],
        ]));
        document.body.appendChild(this._element);
        this._element.focus();
        this._keyboard.enable();
        this.new();
        this._context.getLayer(2).freeze();
        this._context.getLayer(5).freeze();
    }
    new() {
        this._suduku = getSudoku(this._difficulty);
        this._grid = new Grid({
            context: this._context,
            point: { x: (window.innerWidth - 800) / 2, y: ((window.innerHeight - 826) / 2) },
            puzzle: this._suduku.puzzle
        });
    }
    switch(difficulty) {
        this._difficulty = difficulty;
        this._context.getComponents(1).forEach((component) => {
            let color = '#060606';
            if (component.content == difficulty) {
                color = '#815556';
                this._difficulty = difficulty;
            }
            component.getDrawables().forEach((drawable) => {
                if (drawable instanceof Paperless.Drawables.Rectangle)
                    drawable.fillcolor = color;
            });
        });
    }
    onKey(event, self) {
        if (/[1-9]/.test(event.key) && self._context.states.focussed) {
            const x = Math.floor((self._context.states.pointer.current.x - self._grid.x) / 75);
            const y = Math.floor((self._context.states.pointer.current.y - self._grid.y - 100) / 75);
            const target = x + (y * 9);
            self._grid.squares[target].add(event.key);
        }
        event.preventDefault();
    }
    onDelete(event, self) {
        if (self._context.states.focussed) {
            const x = Math.floor((self._context.states.pointer.current.x - self._grid.x) / 75);
            const y = Math.floor((self._context.states.pointer.current.y - self._grid.y - 100) / 75);
            const target = x + (y * 9);
            self._grid.squares[target].remove();
        }
        event.preventDefault();
    }
}

export { Suduku };
