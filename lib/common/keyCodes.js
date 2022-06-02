"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResolvedKeybinding = exports.ResolvedKeybindingPart = exports.ChordKeybinding = exports.SimpleKeybinding = exports.createSimpleKeybinding = exports.createKeybinding = exports.KeyChord = exports.KeyCodeUtils = void 0;
class KeyCodeStrMap {
    constructor() {
        this._keyCodeToStr = [];
        this._strToKeyCode = Object.create(null);
    }
    define(keyCode, str) {
        this._keyCodeToStr[keyCode] = str;
        this._strToKeyCode[str.toLowerCase()] = keyCode;
    }
    keyCodeToStr(keyCode) {
        return this._keyCodeToStr[keyCode];
    }
    strToKeyCode(str) {
        return this._strToKeyCode[str.toLowerCase()] || 0 /* KeyCode.Unknown */;
    }
}
const uiMap = new KeyCodeStrMap();
const userSettingsUSMap = new KeyCodeStrMap();
const userSettingsGeneralMap = new KeyCodeStrMap();
(function () {
    function define(keyCode, uiLabel, usUserSettingsLabel = uiLabel, generalUserSettingsLabel = usUserSettingsLabel) {
        uiMap.define(keyCode, uiLabel);
        userSettingsUSMap.define(keyCode, usUserSettingsLabel);
        userSettingsGeneralMap.define(keyCode, generalUserSettingsLabel);
    }
    define(0 /* KeyCode.Unknown */, 'unknown');
    define(1 /* KeyCode.Backspace */, 'Backspace');
    define(2 /* KeyCode.Tab */, 'Tab');
    define(3 /* KeyCode.Enter */, 'Enter');
    define(4 /* KeyCode.Shift */, 'Shift');
    define(5 /* KeyCode.Ctrl */, 'Ctrl');
    define(6 /* KeyCode.Alt */, 'Alt');
    define(7 /* KeyCode.PauseBreak */, 'PauseBreak');
    define(8 /* KeyCode.CapsLock */, 'CapsLock');
    define(9 /* KeyCode.Escape */, 'Escape');
    define(10 /* KeyCode.Space */, 'Space');
    define(11 /* KeyCode.PageUp */, 'PageUp');
    define(12 /* KeyCode.PageDown */, 'PageDown');
    define(13 /* KeyCode.End */, 'End');
    define(14 /* KeyCode.Home */, 'Home');
    define(15 /* KeyCode.LeftArrow */, 'LeftArrow', 'Left');
    define(16 /* KeyCode.UpArrow */, 'UpArrow', 'Up');
    define(17 /* KeyCode.RightArrow */, 'RightArrow', 'Right');
    define(18 /* KeyCode.DownArrow */, 'DownArrow', 'Down');
    define(19 /* KeyCode.Insert */, 'Insert');
    define(20 /* KeyCode.Delete */, 'Delete');
    define(21 /* KeyCode.KEY_0 */, '0');
    define(22 /* KeyCode.KEY_1 */, '1');
    define(23 /* KeyCode.KEY_2 */, '2');
    define(24 /* KeyCode.KEY_3 */, '3');
    define(25 /* KeyCode.KEY_4 */, '4');
    define(26 /* KeyCode.KEY_5 */, '5');
    define(27 /* KeyCode.KEY_6 */, '6');
    define(28 /* KeyCode.KEY_7 */, '7');
    define(29 /* KeyCode.KEY_8 */, '8');
    define(30 /* KeyCode.KEY_9 */, '9');
    define(31 /* KeyCode.KEY_A */, 'A');
    define(32 /* KeyCode.KEY_B */, 'B');
    define(33 /* KeyCode.KEY_C */, 'C');
    define(34 /* KeyCode.KEY_D */, 'D');
    define(35 /* KeyCode.KEY_E */, 'E');
    define(36 /* KeyCode.KEY_F */, 'F');
    define(37 /* KeyCode.KEY_G */, 'G');
    define(38 /* KeyCode.KEY_H */, 'H');
    define(39 /* KeyCode.KEY_I */, 'I');
    define(40 /* KeyCode.KEY_J */, 'J');
    define(41 /* KeyCode.KEY_K */, 'K');
    define(42 /* KeyCode.KEY_L */, 'L');
    define(43 /* KeyCode.KEY_M */, 'M');
    define(44 /* KeyCode.KEY_N */, 'N');
    define(45 /* KeyCode.KEY_O */, 'O');
    define(46 /* KeyCode.KEY_P */, 'P');
    define(47 /* KeyCode.KEY_Q */, 'Q');
    define(48 /* KeyCode.KEY_R */, 'R');
    define(49 /* KeyCode.KEY_S */, 'S');
    define(50 /* KeyCode.KEY_T */, 'T');
    define(51 /* KeyCode.KEY_U */, 'U');
    define(52 /* KeyCode.KEY_V */, 'V');
    define(53 /* KeyCode.KEY_W */, 'W');
    define(54 /* KeyCode.KEY_X */, 'X');
    define(55 /* KeyCode.KEY_Y */, 'Y');
    define(56 /* KeyCode.KEY_Z */, 'Z');
    define(57 /* KeyCode.Meta */, 'Meta');
    define(58 /* KeyCode.ContextMenu */, 'ContextMenu');
    define(59 /* KeyCode.F1 */, 'F1');
    define(60 /* KeyCode.F2 */, 'F2');
    define(61 /* KeyCode.F3 */, 'F3');
    define(62 /* KeyCode.F4 */, 'F4');
    define(63 /* KeyCode.F5 */, 'F5');
    define(64 /* KeyCode.F6 */, 'F6');
    define(65 /* KeyCode.F7 */, 'F7');
    define(66 /* KeyCode.F8 */, 'F8');
    define(67 /* KeyCode.F9 */, 'F9');
    define(68 /* KeyCode.F10 */, 'F10');
    define(69 /* KeyCode.F11 */, 'F11');
    define(70 /* KeyCode.F12 */, 'F12');
    define(71 /* KeyCode.F13 */, 'F13');
    define(72 /* KeyCode.F14 */, 'F14');
    define(73 /* KeyCode.F15 */, 'F15');
    define(74 /* KeyCode.F16 */, 'F16');
    define(75 /* KeyCode.F17 */, 'F17');
    define(76 /* KeyCode.F18 */, 'F18');
    define(77 /* KeyCode.F19 */, 'F19');
    define(78 /* KeyCode.NumLock */, 'NumLock');
    define(79 /* KeyCode.ScrollLock */, 'ScrollLock');
    define(80 /* KeyCode.US_SEMICOLON */, ';', ';', 'OEM_1');
    define(81 /* KeyCode.US_EQUAL */, '=', '=', 'OEM_PLUS');
    define(82 /* KeyCode.US_COMMA */, ',', ',', 'OEM_COMMA');
    define(83 /* KeyCode.US_MINUS */, '-', '-', 'OEM_MINUS');
    define(84 /* KeyCode.US_DOT */, '.', '.', 'OEM_PERIOD');
    define(85 /* KeyCode.US_SLASH */, '/', '/', 'OEM_2');
    define(86 /* KeyCode.US_BACKTICK */, '`', '`', 'OEM_3');
    define(110 /* KeyCode.ABNT_C1 */, 'ABNT_C1');
    define(111 /* KeyCode.ABNT_C2 */, 'ABNT_C2');
    define(87 /* KeyCode.US_OPEN_SQUARE_BRACKET */, '[', '[', 'OEM_4');
    define(88 /* KeyCode.US_BACKSLASH */, '\\', '\\', 'OEM_5');
    define(89 /* KeyCode.US_CLOSE_SQUARE_BRACKET */, ']', ']', 'OEM_6');
    define(90 /* KeyCode.US_QUOTE */, '\'', '\'', 'OEM_7');
    define(91 /* KeyCode.OEM_8 */, 'OEM_8');
    define(92 /* KeyCode.OEM_102 */, 'OEM_102');
    define(93 /* KeyCode.NUMPAD_0 */, 'NumPad0');
    define(94 /* KeyCode.NUMPAD_1 */, 'NumPad1');
    define(95 /* KeyCode.NUMPAD_2 */, 'NumPad2');
    define(96 /* KeyCode.NUMPAD_3 */, 'NumPad3');
    define(97 /* KeyCode.NUMPAD_4 */, 'NumPad4');
    define(98 /* KeyCode.NUMPAD_5 */, 'NumPad5');
    define(99 /* KeyCode.NUMPAD_6 */, 'NumPad6');
    define(100 /* KeyCode.NUMPAD_7 */, 'NumPad7');
    define(101 /* KeyCode.NUMPAD_8 */, 'NumPad8');
    define(102 /* KeyCode.NUMPAD_9 */, 'NumPad9');
    define(103 /* KeyCode.NUMPAD_MULTIPLY */, 'NumPad_Multiply');
    define(104 /* KeyCode.NUMPAD_ADD */, 'NumPad_Add');
    define(105 /* KeyCode.NUMPAD_SEPARATOR */, 'NumPad_Separator');
    define(106 /* KeyCode.NUMPAD_SUBTRACT */, 'NumPad_Subtract');
    define(107 /* KeyCode.NUMPAD_DECIMAL */, 'NumPad_Decimal');
    define(108 /* KeyCode.NUMPAD_DIVIDE */, 'NumPad_Divide');
})();
var KeyCodeUtils;
(function (KeyCodeUtils) {
    function toString(keyCode) {
        return uiMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toString = toString;
    function fromString(key) {
        return uiMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromString = fromString;
    function toUserSettingsUS(keyCode) {
        return userSettingsUSMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsUS = toUserSettingsUS;
    function toUserSettingsGeneral(keyCode) {
        return userSettingsGeneralMap.keyCodeToStr(keyCode);
    }
    KeyCodeUtils.toUserSettingsGeneral = toUserSettingsGeneral;
    function fromUserSettings(key) {
        return userSettingsUSMap.strToKeyCode(key) || userSettingsGeneralMap.strToKeyCode(key);
    }
    KeyCodeUtils.fromUserSettings = fromUserSettings;
})(KeyCodeUtils = exports.KeyCodeUtils || (exports.KeyCodeUtils = {}));
function KeyChord(firstPart, secondPart) {
    let chordPart = ((secondPart & 0x0000FFFF) << 16) >>> 0;
    return (firstPart | chordPart) >>> 0;
}
exports.KeyChord = KeyChord;
function createKeybinding(keybinding, OS) {
    if (keybinding === 0) {
        return null;
    }
    const firstPart = (keybinding & 0x0000FFFF) >>> 0;
    const chordPart = (keybinding & 0xFFFF0000) >>> 16;
    if (chordPart !== 0) {
        return new ChordKeybinding(createSimpleKeybinding(firstPart, OS), createSimpleKeybinding(chordPart, OS));
    }
    return createSimpleKeybinding(firstPart, OS);
}
exports.createKeybinding = createKeybinding;
function createSimpleKeybinding(keybinding, OS) {
    const ctrlCmd = (keybinding & 2048 /* BinaryKeybindingsMask.CtrlCmd */ ? true : false);
    const winCtrl = (keybinding & 256 /* BinaryKeybindingsMask.WinCtrl */ ? true : false);
    const ctrlKey = (OS === 2 /* OperatingSystem.Macintosh */ ? winCtrl : ctrlCmd);
    const shiftKey = (keybinding & 1024 /* BinaryKeybindingsMask.Shift */ ? true : false);
    const altKey = (keybinding & 512 /* BinaryKeybindingsMask.Alt */ ? true : false);
    const metaKey = (OS === 2 /* OperatingSystem.Macintosh */ ? ctrlCmd : winCtrl);
    const keyCode = (keybinding & 255 /* BinaryKeybindingsMask.KeyCode */);
    return new SimpleKeybinding(ctrlKey, shiftKey, altKey, metaKey, keyCode);
}
exports.createSimpleKeybinding = createSimpleKeybinding;
class SimpleKeybinding {
    constructor(ctrlKey, shiftKey, altKey, metaKey, keyCode) {
        this.type = 1 /* KeybindingType.Simple */;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.metaKey = metaKey;
        this.keyCode = keyCode;
    }
    equals(other) {
        if (other.type !== 1 /* KeybindingType.Simple */) {
            return false;
        }
        return (this.ctrlKey === other.ctrlKey
            && this.shiftKey === other.shiftKey
            && this.altKey === other.altKey
            && this.metaKey === other.metaKey
            && this.keyCode === other.keyCode);
    }
    getHashCode() {
        let ctrl = this.ctrlKey ? '1' : '0';
        let shift = this.shiftKey ? '1' : '0';
        let alt = this.altKey ? '1' : '0';
        let meta = this.metaKey ? '1' : '0';
        return `${ctrl}${shift}${alt}${meta}${this.keyCode}`;
    }
    isModifierKey() {
        return (this.keyCode === 0 /* KeyCode.Unknown */
            || this.keyCode === 5 /* KeyCode.Ctrl */
            || this.keyCode === 57 /* KeyCode.Meta */
            || this.keyCode === 6 /* KeyCode.Alt */
            || this.keyCode === 4 /* KeyCode.Shift */);
    }
    /**
     * Does this keybinding refer to the key code of a modifier and it also has the modifier flag?
     */
    isDuplicateModifierCase() {
        return ((this.ctrlKey && this.keyCode === 5 /* KeyCode.Ctrl */)
            || (this.shiftKey && this.keyCode === 4 /* KeyCode.Shift */)
            || (this.altKey && this.keyCode === 6 /* KeyCode.Alt */)
            || (this.metaKey && this.keyCode === 57 /* KeyCode.Meta */));
    }
}
exports.SimpleKeybinding = SimpleKeybinding;
class ChordKeybinding {
    constructor(firstPart, chordPart) {
        this.type = 2 /* KeybindingType.Chord */;
        this.firstPart = firstPart;
        this.chordPart = chordPart;
    }
    getHashCode() {
        return `${this.firstPart.getHashCode()};${this.chordPart.getHashCode()}`;
    }
}
exports.ChordKeybinding = ChordKeybinding;
class ResolvedKeybindingPart {
    constructor(ctrlKey, shiftKey, altKey, metaKey, kbLabel, kbAriaLabel) {
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.altKey = altKey;
        this.metaKey = metaKey;
        this.keyLabel = kbLabel;
        this.keyAriaLabel = kbAriaLabel;
    }
}
exports.ResolvedKeybindingPart = ResolvedKeybindingPart;
/**
 * A resolved keybinding. Can be a simple keybinding or a chord keybinding.
 */
class ResolvedKeybinding {
}
exports.ResolvedKeybinding = ResolvedKeybinding;
//# sourceMappingURL=keyCodes.js.map