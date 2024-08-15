import * as Paperless from '@zone09.net/paperless';
import {IButton} from '../interfaces/IButton.js';



export class Button extends Paperless.Component 
{
	private _content: string;
	private _fillcolor: string;
	private _onLeftClick: () => void;
	//---

	public constructor(attributes: IButton = {}) 
	{
		super(attributes);

		this._content = attributes.content;
		this._fillcolor = attributes.fillcolor;
		this._onLeftClick = attributes.onLeftClick;

		this.generate();
	}

	public generate(): void
	{
		const rectangle: Paperless.Drawables.Rectangle = new Paperless.Drawables.Rectangle({
			context: this.context,
			point: {x: this.x + 65, y: this.y + 13},
			size: {width: 130, height: 26},
			nostroke: true,
			fillcolor: this._fillcolor
		});

		this.enroll(rectangle);
		this.enroll(
			new Paperless.Drawables.Label({
				context: this.context,
				matrix: rectangle.matrix,
				autosize: true,
				fillcolor: '#151515',
				font: '20px CPMono-v07-Light',
				content: this._content,
				padding: {top: 1},
			})
		);
		this.enroll(	
			new Paperless.Controls.Button({
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
			})
		);
	}

  	public onDetach(): void
  	{
  		this.detachEnrolled();
	}


	// Accessors
	// --------------------------------------------------------------------------

	public get content(): string
	{
		return this._content;
	}
}

