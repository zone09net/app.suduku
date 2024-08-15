import * as Paperless from '@zone09.net/paperless';
import * as Foundation from '@zone09.net/foundation';
import {getSudoku} from '@extlib/sudukugen';
import {Grid} from './components/Grid.js';
import {Button} from './components/Button.js';
import {Square} from './components/Square';



export class Suduku 
{
	private _context: Paperless.Context;
	private _grid: Grid;
	private _difficulty: string = 'easy';
	private _suduku: {puzzle: string, solution: string, difficulty: string};
	private _element: HTMLTextAreaElement = document.createElement('textarea');
	private _keyboard: Foundation.Keyboard = new Foundation.Keyboard(this._element, this);
	//---

	public constructor()
	{
		let sheet = new CSSStyleSheet();
		sheet.replaceSync(`
			body {
				overflow: hidden;
				background-color: #000000;
				margin: 0px;
				padding: 0px;
				image-rendering: pixelated;
				user-select: none;
			}
		`);
		// @ts-ignore
		document.adoptedStyleSheets = [sheet]

		this._context = new Paperless.Context({
			autosize: true, 
			layer: 0,
		});

		this._context.attach(document.body);

		new Button({
			context: this._context,
			point: {x: ((window.innerWidth - 800) / 2), y: ((window.innerHeight - 826) / 2) + 800},
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
			point: {x: ((window.innerWidth - 800) / 2) + 135, y: ((window.innerHeight - 826) / 2) + 800},
			content: 'easy',
			fillcolor: '#815556',
			onLeftClick: () => {
				this.switch('easy');
			}
		});	

		new Button({
			context: this._context,
			layer: 1,
			point: {x: ((window.innerWidth - 800) / 2) + 270, y: ((window.innerHeight - 826) / 2) + 800},
			content: 'medium',
			fillcolor: '#060606',
			onLeftClick: () => {
				this.switch('medium');
			}
		});	

		new Button({
			context: this._context,
			layer: 1,
			point: {x: ((window.innerWidth - 800) / 2) + 405, y: ((window.innerHeight - 826) / 2) + 800},
			content: 'hard',
			fillcolor: '#060606',
			onLeftClick: () => {
				this.switch('hard');
			}
		});

		new Button({
			context: this._context,
			layer: 1,
			point: {x: ((window.innerWidth - 800) / 2) + 540, y: ((window.innerHeight - 826) / 2) + 800},
			content: 'expert',
			fillcolor: '#060606',
			onLeftClick: () => {
				this.switch('expert');
			}
		});

		new Paperless.MouseAction({
			context: this._context,
			onMouseMove: () => {
				const x: number = Math.floor((this._context.states.pointer.current.x - this._grid.x) / 75);
				const y: number = Math.floor((this._context.states.pointer.current.y - this._grid.y - 100) / 75);
				const target: number = x + (y * 9);

				if(x >= 0 && y >= 0 && x <= 8 && y <= 8 && target <= 80 && this._grid.squares[target])
					this._context.setFocus(this._grid.squares[target].highlight.guid);
				else
					this._context.removeFocus();
			}
		});

		this._keyboard.setKeydownCallbacks(
			new Map([
				['key', [this.onKey]],
				['delete', [this.onDelete]],
			])
		);

		document.body.appendChild(this._element);
		this._element.focus();
		this._keyboard.enable();
		this.new();

		this._context.getLayer(2).freeze();
		this._context.getLayer(5).freeze();
	}

	public new(): void
	{
		this._suduku = getSudoku(this._difficulty);

		this._grid = new Grid({
			context: this._context,
			point: {x: (window.innerWidth - 800) / 2, y: ((window.innerHeight - 826) / 2)},
			puzzle: this._suduku.puzzle
		});
	}

	public switch(difficulty: string): void
	{
		this._difficulty = difficulty;
		
		this._context.getComponents(1).forEach((component: Button) => {
			let color: string = '#060606';

			if(component.content == difficulty)
			{
				color = '#815556';
				this._difficulty = difficulty;
			}

			component.getDrawables().forEach((drawable: Paperless.Drawable) => {
				if(drawable instanceof Paperless.Drawables.Rectangle)
					drawable.fillcolor = color;
			});
		});
	}

	private onKey(event: HTMLElementEventMap['keydown'], self: Suduku)
	{
		if(/[1-9]/.test(event.key) && self._context.states.focussed)
		{
			const x: number = Math.floor((self._context.states.pointer.current.x - self._grid.x) / 75);
			const y: number = Math.floor((self._context.states.pointer.current.y - self._grid.y - 100) / 75);
			const target: number = x + (y * 9);

			self._grid.squares[target].add(event.key);
		}

		event.preventDefault();
	}

	private onDelete(event: HTMLElementEventMap['keydown'], self: Suduku)
	{
		if(self._context.states.focussed)
		{
			const x: number = Math.floor((self._context.states.pointer.current.x - self._grid.x) / 75);
			const y: number = Math.floor((self._context.states.pointer.current.y - self._grid.y - 100) / 75);
			const target: number = x + (y * 9);

			self._grid.squares[target].remove();
		}

		event.preventDefault();
	}
}


