import * as Paperless from '@zone09.net/paperless';
import {Square} from './Square.js';
import {IGrid} from '../interfaces/IGrid.js';



export class Grid extends Paperless.Component 
{
	private _puzzle: string;
	private _squares: Square[] = [];
	//---
	
	public constructor(attributes: IGrid = {}) 
	{
		super(attributes);

		this._puzzle = attributes.puzzle;

		this.generate();
	}

	public generate(): void
	{
		let x: number = (window.innerWidth - (8 * 75)) / 2;
		let y: number = (window.innerHeight - (8 * 75)) / 2;
		let count: number = 0;


		for(let i: number = 0; i < 9; i++)
		{
			this.enroll(
				new Square({
					context: this.context,
					layer: 5,
					point: {x: this.x + 700, y: this.y + (i * 75) + 100},
					placeholder: '--',
				})
			);
		}

		for(let i: number = 0; i < 9; i++)
		{
			this.enroll(
				new Square({
					context: this.context,
					layer: 5,
					point: {x: this.x + (i * 75), y: this.y},
					placeholder: '--',
				})
			);
		}

		for(let i: number = 0; i < 9; i++)
		{
			for(let j: number = 0; j < 9; j++)
			{
				const square: Square = new Square({
					context: this.context,
					layer: this._puzzle[count] == '-' ? 5 : 2,
					point: {x: this.x + (j * 75), y: this.y + (i * 75) + 100},
					placeholder: this._puzzle[count],
				});

				this.enroll(square);

				if(this._puzzle[count] == '-')
					this._squares.push(square);
				else
					this._squares.push(null);

				count++;
			}
		}

		this.enroll(
			new Paperless.Drawables.Rectangle({
				context: this.context,
				layer: 2, 
				point: {x: this.x + 337.5, y: this.y + 437.5},
				size: {width: 675, height: 675},
				strokecolor: '#815556',
				nofill: true,
				hoverable: false,
				linewidth: 5
			})
		);

		this.enroll(
			new Paperless.Drawables.Line({
				context: this.context,
				layer: 2,
				point0: {x: this.x, y: this.y + 325},
				point1: {x: this.x + 675, y: this.y + 325},
				strokecolor: '#815556',
				linewidth: 5,
				hoverable: false,
			})
		);

		this.enroll(
			new Paperless.Drawables.Line({
				context: this.context,
				layer: 2,
				point0: {x: this.x, y: this.y + 550},
				point1: {x: this.x + 675, y: this.y + 550},
				strokecolor: '#815556',
				linewidth: 5,
				hoverable: false,
			})
		);

		this.enroll(
			new Paperless.Drawables.Line({
				context: this.context,
				layer: 2,
				point0: {x: this.x + 225, y: this.y + 100},
				point1: {x: this.x + 225, y: this.y + 775},
				strokecolor: '#815556',
				linewidth: 5,
				hoverable: false,
			})
		);

		this.enroll(
			new Paperless.Drawables.Line({
				context: this.context,
				layer: 2,
				point0: {x: this.x + 450, y: this.y + 100},
				point1: {x: this.x + 450, y: this.y + 775},
				strokecolor: '#815556',
				linewidth: 5,
				hoverable: false,
			})
		);

		for(let i: number = 0; i < 8; i++)
		{
			if(i != 2 && i != 5)
			{
				this.enroll(
					new Paperless.Drawables.Line({
						context: this.context,
						layer: 2,
						point0: {x: this.x + 75 + (i * 75), y: this.y + 100},
						point1: {x: this.x + 75 + (i * 75), y: this.y + 775},
						strokecolor: '#815556',
						linewidth: 1,
						hoverable: false,
						alpha: 0.3,
					})
				);

				this.enroll(
					new Paperless.Drawables.Line({
						context: this.context,
						layer: 2,
						point0: {x: this.x, y: this.y + 175 + (i * 75)},
						point1: {x: this.x + 675, y: this.y + 175 + (i * 75)},
						strokecolor: '#815556',
						linewidth: 1,
						hoverable: false,
						alpha: 0.3,
					})
				);
			}
		}
	}

  	public onDetach(): void
  	{
  		this.detachEnrolled();
  		this._squares = [];
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get squares(): Square[]
	{
		return this._squares;
	}	
}

