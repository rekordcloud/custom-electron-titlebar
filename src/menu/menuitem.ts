/*--------------------------------------------------------------------------------------------------------
 *  This file has been modified by @AlexTorresSk (http://github.com/AlexTorresSk)
 *  to work in custom-electron-titlebar.
 *
 *  The original copy of this file and its respective license are in https://github.com/Microsoft/vscode/
 *
 *  Copyright (c) 2018 Alex Torres
 *  Licensed under the MIT License. See License in the project root for license information.
 *-------------------------------------------------------------------------------------------------------*/

import { EventType, addDisposableListener, addClass, removeClass, removeNode, append, $, hasClass, EventHelper, EventLike } from "../common/dom";
import { MenuItem } from "electron";
import { IMenuStyle, MENU_MNEMONIC_REGEX, cleanMnemonic, MENU_ESCAPED_MNEMONIC_REGEX, IMenuOptions } from "./menu";
import { KeyCode, KeyCodeUtils } from "../common/keyCodes";
import { Disposable } from "../common/lifecycle";
import { isMacintosh } from "../common/platform";
import { MenubarOptions } from "../interfaces";
import defaultIcons from '../styles/icons.json';

export interface IMenuItem {
	render(element: HTMLElement): void;
	isEnabled(): boolean;
	isSeparator(): boolean;
	focus(): void;
	blur(): void;
	dispose(): void;
}

export class CETMenuItem extends Disposable implements IMenuItem {

	protected menubarOptions: MenubarOptions;
	protected options: IMenuOptions;
	protected menuStyle: IMenuStyle;
	protected container: HTMLElement;
	protected itemElement: HTMLElement;

	private item: MenuItem;

	private radioGroup: { start: number, end: number }; // used only if item.type === "radio"
	private labelElement: HTMLElement;
	private iconElement: HTMLElement;
	private mnemonic: KeyCode;
	protected closeSubMenu: () => void;
	protected menuContainer: IMenuItem[];

	constructor(item: MenuItem, menubarOptions: MenubarOptions, options: IMenuOptions = {}, closeSubMenu = () => { }, menuContainer: IMenuItem[] = undefined) {
		super();

		this.item = item;
		this.menubarOptions = menubarOptions;
		this.options = options;
		this.closeSubMenu = closeSubMenu;
		this.menuContainer = menuContainer;

		// Set mnemonic
		if (this.item.label && options.enableMnemonics) {
			let label = this.item.label;
			if (label) {
				let matches = MENU_MNEMONIC_REGEX.exec(label);
				if (matches) {
					this.mnemonic = KeyCodeUtils.fromString((!!matches[1] ? matches[1] : matches[2]).toLocaleUpperCase());
				}
			}
		}
	}

	getContainer() {
		return this.container;
	}

	getItem(): MenuItem {
		return this.item;
	}

	isEnabled(): boolean {
		return this.item.enabled;
	}

	isSeparator(): boolean {
		return this.item.type === 'separator';
	}

	render(container: HTMLElement): void {
		this.container = container;

		this._register(addDisposableListener(this.container, EventType.MOUSE_DOWN, e => {
			if (this.item.enabled && e.button === 0 && this.container) {
				addClass(this.container, 'active');
			}
		}));

		this._register(addDisposableListener(this.container, EventType.CLICK, e => {
			if (this.item.enabled) {
				this.onClick(e);
			}
		}));

		this._register(addDisposableListener(this.container, EventType.DBLCLICK, e => {
			EventHelper.stop(e, true);
		}));

		[EventType.MOUSE_UP, EventType.MOUSE_OUT].forEach(event => {
			this._register(addDisposableListener(this.container!, event, e => {
				EventHelper.stop(e);
				removeClass(this.container!, 'active');
			}));
		});

		this.itemElement = append(this.container, $('a.cet-action-menu-item'));
		let role = 'menuitem';
		switch (this.item.type) {
			case 'checkbox':
			case 'radio':
				role += this.item.type;
				break;
			case 'separator':
				role = this.item.type;
				break;
			case 'submenu':
				this.itemElement.setAttribute('aria-haspopup', 'true');
		}
		this.itemElement.setAttribute('role', role);

		if (this.mnemonic) {
			this.itemElement.setAttribute('aria-keyshortcuts', `${this.mnemonic}`);
		}

		this.iconElement = append(this.itemElement, $('span.cet-menu-item-icon'));
		this.iconElement.setAttribute('role', 'none');

		this.labelElement = append(this.itemElement, $('span.cet-action-label'));

		this.setAccelerator();
		this.updateLabel();
		this.updateIcon();
		this.updateTooltip();
		this.updateEnabled();
		this.updateChecked();
		this.updateVisibility();
	}

	onClick(event: EventLike) {
		EventHelper.stop(event, true);
		this.menubarOptions.onMenuItemClick(this.item.commandId);

		if (this.item.type === 'checkbox') {
			this.item.checked = !this.item.checked;
			this.updateChecked();
		} else if (this.item.type === 'radio') {
			this.updateRadioGroup();
		} else {
			this.closeSubMenu();
		}

	}

	focus(): void {
		if (this.container) {
			this.container.focus();
			addClass(this.container, 'focused');
		}

		this.applyStyle();
	}

	blur(): void {
		if (this.container) {
			this.container.blur();
			removeClass(this.container, 'focused');
		}

		this.applyStyle();
	}

	setAccelerator(): void {
		var accelerator = null;

		if (this.item.role) {
			switch (this.item.role.toLocaleLowerCase()) {
				case 'undo':
					accelerator = 'CtrlOrCmd+Z';
					break;
				case 'redo':
					accelerator = 'CtrlOrCmd+Y';
					break;
				case 'cut':
					accelerator = 'CtrlOrCmd+X';
					break;
				case 'copy':
					accelerator = 'CtrlOrCmd+C';
					break;
				case 'paste':
					accelerator = 'CtrlOrCmd+V';
					break;
				case 'selectall':
					accelerator = 'CtrlOrCmd+A';
					break;
				case 'minimize':
					accelerator = 'CtrlOrCmd+M';
					break;
				case 'close':
					accelerator = 'CtrlOrCmd+W';
					break;
				case 'reload':
					accelerator = 'CtrlOrCmd+R';
					break;
				case 'forcereload':
					accelerator = 'CtrlOrCmd+Shift+R';
					break;
				case 'toggledevtools':
					accelerator = 'CtrlOrCmd+Shift+I';
					break;
				case 'togglefullscreen':
					accelerator = 'F11';
					break;
				case 'resetzoom':
					accelerator = 'CtrlOrCmd+0';
					break;
				case 'zoomin':
					accelerator = 'CtrlOrCmd+Shift+=';
					break;
				case 'zoomout':
					accelerator = 'CtrlOrCmd+-';
					break;
			}
		}

		if (this.item.label && this.item.accelerator) {
			accelerator = this.item.accelerator;
		}

		if (accelerator !== null) {
			append(this.itemElement, $('span.keybinding')).textContent = parseAccelerator(accelerator);
		}
	}

	updateLabel(): void {
		if (this.item.label) {
			let label = this.item.label;

			if (label) {
				const cleanLabel = cleanMnemonic(label);

				if (!this.options.enableMnemonics) {
					label = cleanLabel;
				}

				if (this.labelElement) {
					this.labelElement.setAttribute('aria-label', cleanLabel.replace(/&&/g, '&'));
				}

				const matches = MENU_MNEMONIC_REGEX.exec(label);

				if (matches) {
					label = escape(label);

					// This is global, reset it
					MENU_ESCAPED_MNEMONIC_REGEX.lastIndex = 0;
					let escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);

					// We can't use negative lookbehind so if we match our negative and skip
					while (escMatch && escMatch[1]) {
						escMatch = MENU_ESCAPED_MNEMONIC_REGEX.exec(label);
					}

					if (escMatch) {
						label = `${label.substr(0, escMatch.index)}<u aria-hidden="true">${escMatch[3]}</u>${label.substr(escMatch.index + escMatch[0].length)}`;
					}

					label = label.replace(/&amp;&amp;/g, '&amp;');
					if (this.itemElement) {
						this.itemElement.setAttribute('aria-keyshortcuts', (!!matches[1] ? matches[1] : matches[3]).toLocaleLowerCase());
					}
				} else {
					label = label.replace(/&&/g, '&');
				}
			}

			if (this.labelElement) {
				this.labelElement.innerHTML = label.trim();
			}
		}
	}

	updateIcon(): void {
		if (this.item.icon) {
			const icon = this.item.icon;

			if (icon) {
				const iconE = append(this.iconElement, $('img'));
				iconE.setAttribute('src', icon.toString());
			}
		} else if (this.item.type === 'checkbox') {
			addClass(this.iconElement, 'checkbox');
			this.iconElement.innerHTML = defaultIcons.check;
		} else if (this.item.type === 'radio') {
			addClass(this.iconElement, 'radio');
			this.iconElement.innerHTML = this.item.checked ? defaultIcons.radio.checked : defaultIcons.radio.unchecked ;
		}

		if (this.iconElement.firstElementChild) {
			this.iconElement.firstElementChild.setAttribute('fill', this.menubarOptions.svgColor?.toString() || this.menuStyle?.foregroundColor?.toString() || undefined)
		}
	}

	updateTooltip(): void {
		let title: string | null = null;

		if (this.item.sublabel) {
			title = this.item.sublabel;
		} else if (!this.item.label && this.item.label && this.item.icon) {
			title = this.item.label;

			if (this.item.accelerator) {
				title = parseAccelerator(this.item.accelerator);
			}
		}

		if (title) {
			this.itemElement.title = title;
		}
	}

	updateEnabled(): void {
		if (this.item.enabled && this.item.type !== 'separator') {
			removeClass(this.container, 'disabled');
			this.container.tabIndex = 0;
		} else {
			addClass(this.container, 'disabled');
		}
	}

	updateVisibility(): void {
		if (this.item.visible === false && this.itemElement) {
			this.itemElement.remove();
		}
	}

	updateChecked(): void {
		if (this.item.checked) {
			addClass(this.itemElement, 'checked');
			this.itemElement.setAttribute('aria-checked', 'true');
		} else {
			removeClass(this.itemElement, 'checked');
			this.itemElement.setAttribute('aria-checked', 'false');
		}
	}

	updateRadioGroup(): void {
		if (this.radioGroup === undefined) {
			this.radioGroup = this.getRadioGroup();
		}
		for (let i = this.radioGroup.start; i < this.radioGroup.end; i++) {
			const menuItem = this.menuContainer[i];
			if (menuItem instanceof CETMenuItem && menuItem.item.type === 'radio') {
				// update item.checked for each radio button in group
				menuItem.item.checked = menuItem === this; 
				menuItem.updateIcon();
				// updateChecked() *all* radio buttons in group
				menuItem.updateChecked();
				// set the radioGroup property of all the other radio buttons since it was already calculated
				if (menuItem !== this) {
					menuItem.radioGroup = this.radioGroup;
				}
			}
		}
	}

	/** radioGroup index's starts with (previous separator +1 OR menuContainer[0]) and ends with (next separator OR menuContainer[length]) */
	getRadioGroup(): { start: number, end: number } {
		let startIndex = 0;
		let endIndex = this.menuContainer.length;
		let found = false;

		for (const index in this.menuContainer) {
			const menuItem = this.menuContainer[index];
			if (menuItem === this) {
				found = true;
			} else if (menuItem instanceof CETMenuItem && menuItem.isSeparator()) {
				if (found) {
					endIndex = Number.parseInt(index);
					break;
				} else {
					startIndex = Number.parseInt(index) + 1;
				}
			}
		}
		return { start: startIndex, end: endIndex };
	}

	dispose(): void {
		if (this.itemElement) {
			removeNode(this.itemElement);
			this.itemElement = undefined;
		}

		super.dispose();
	}

	getMnemonic(): KeyCode {
		return this.mnemonic;
	}

	protected applyStyle(): void {
		if (!this.menuStyle) {
			return;
		}

		const isSelected = this.container && hasClass(this.container, 'focused');
		const fgColor = isSelected && this.menuStyle.selectionForegroundColor ? this.menuStyle.selectionForegroundColor : this.menuStyle.foregroundColor;
		const bgColor = isSelected && this.menuStyle.selectionBackgroundColor ? this.menuStyle.selectionBackgroundColor : null;

		this.itemElement.style.color = fgColor ? fgColor.toString() : null;
		this.itemElement.style.backgroundColor = bgColor ? bgColor.toString() : null;
	}

	style(style: IMenuStyle): void {
		this.menuStyle = style;
		this.applyStyle();
	}
}

function parseAccelerator(a: any): string {
	var accelerator = a.toString();

	if (!isMacintosh) {
		accelerator = accelerator.replace(/(Cmd)|(Command)/gi, '');
	} else {
		accelerator = accelerator.replace(/(Ctrl)|(Control)/gi, '');
	}

	accelerator = accelerator.replace(/(Or)/gi, '');

	return accelerator;
}
