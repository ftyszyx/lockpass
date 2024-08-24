export type Callback = (err: string) => void

export type MouseButtonString = 'left' | 'right' | 'middle'

//other
export function setKeyboardDelay(ms: number): void
export function setMouseDelay(delay: number): void
export function getScreenSize(): { width: number; height: number }
export function updateScreenMetrics(): void

//keyboard
export function keyTap(key: string, modifier?: string | string[]): void
export function keyToggle(key: string, down: string, modifier?: string | string[]): void
export function typeString(string: string): void

//mouse
export function dragMouse(x: number, y: number): void
export function moveMouse(x: number, y: number): void
export function moveMouseSmooth(x: number, y: number, speed?: number): void
export function mouseClick(button?: MouseButton, double?: boolean): void
export function mouseToggle(down?: boolean, button?: MouseButton): void
export function getMousePos(): { x: number; y: number }
