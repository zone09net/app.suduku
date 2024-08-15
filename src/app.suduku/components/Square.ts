import * as Paperless from '@zone09.net/paperless';
import {ISquare} from '../interfaces/ISquare.js';



export class Square extends Paperless.Component 
{
	private _placeholder: string;
	private _highlight: Paperless.Control;
	private _placed: Paperless.Drawables.Label;
	//---

	public constructor(attributes: ISquare = {}) 
	{
		super(attributes);

		this._placeholder = attributes.placeholder;

		this.generate();
	}

	public generate(): void
	{
		if(this._placeholder == '-' || this._placeholder == '--' )
		{
			let count: number = 1;

			for(let i: number = 0; i < 3; i++)
			{
				for(let j: number = 0; j < 3; j++)
				{
					const label: Paperless.Drawables.Label = new Paperless.Drawables.Label({
						context: this.context,
						layer: 5,
						point: {x: this.x - 21 + 37.5 + (j * 20), y: this.y - 16 + 37.5 + (i * 20)},
						autosize: true,
						content: String(count++),
						fillcolor: '#815556',
						font: '20px CPMono-v07-Light',
						alpha: 0.2,
						sticky: true
					});

					this.enroll(label);
					this.enroll(
						new Paperless.Controls.Button({
							context: this.context,
							layer: 5,
							movable: false,
							focusable: false,
							drawable: label,
							onLeftClick: (self: Paperless.Control) => {
								this.context.getLayer(5).unfreeze();
								if(self.drawable.alpha == 0.2)
								{
									self.drawable.alpha = 1;
									self.drawable.fillcolor = '#815556';
									self.drawable.generate();
								}
								else
								{
									self.drawable.alpha = 0.2;
									self.drawable.fillcolor = '#815556';
									self.drawable.generate();
								}
								this.context.getLayer(5).freeze();
							},
							onRightClick: (self: Paperless.Control) => {
								this.context.getLayer(5).unfreeze();
								if(self.drawable.alpha == 0.2)
								{
									self.drawable.alpha = 1;
									self.drawable.fillcolor = '#436665';
									self.drawable.generate();
								}
								else
								{
									self.drawable.alpha = 0.2;
									self.drawable.fillcolor = '#815556';
									self.drawable.generate();
								}
								this.context.getLayer(5).freeze();
							},
						})
					);
				}
			}

			if(this._placeholder == '-')
			{
				const rectangle: Paperless.Drawables.Rectangle = new Paperless.Drawables.Rectangle({
					context: this.context,
					layer: 0,
					point: {x: this.x + 37.5, y: this.y + 37.5},
					size: {width: 75, height: 75},
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
					onFocus: (self: Paperless.Control) => {
						self.drawable.alpha = 1;
						this.context.refresh();
					},
					onLostFocus: (self: Paperless.Control) => {
						self.drawable.alpha = 0;
						this.context.refresh();
					},
				})

				this.enroll(rectangle);
				this.enroll(this._highlight);
			}
		}
		else
		{
			this.enroll(
				new Paperless.Drawables.Label({
					context: this.context,
					layer: 2,
					point: {x: this.x + 37.5, y: this.y + 37.5},
					size: {width: 75, height: 75},
					fillcolor:' #436665',
					font: '46px CPMono-v07-Light',
					padding: {top: 2},
					autosize: true,
					hoverable: false,
					content: this._placeholder
				})
			);
		}
	}

	public add(number: string): void
	{
		if(this._placed)
			this.context.detach(this._placed.guid);

		this._placed = new Paperless.Drawables.Label({
			context: this.context,
			layer: 6,
			point: {x: this.x + 37.5, y: this.y + 37.5},
			size: {width: 75, height: 75},
			fillcolor:' #436665',
			font: '46px CPMono-v07-Light',
			padding: {top: 2},
			autosize: true,
			hoverable: false,
			content: number
		});

		this.enroll(this._placed);

		this.context.refresh();
	}

	public remove(): void
	{
		if(this._placed)
		{
			this.context.detach(this._placed.guid);
			this.context.refresh();
		}
	}

  	public onDetach(): void
  	{
  		this.detachEnrolled();
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	public get highlight(): Paperless.Control
	{
		return this._highlight;
	}	
}

