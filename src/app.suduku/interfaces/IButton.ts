import * as Paperless from '@zone09.net/paperless';



export interface IButton extends Paperless.Interfaces.IComponentAttributes
{
	content?: string,
	fillcolor?: string,
	onLeftClick?: () => void,
}

