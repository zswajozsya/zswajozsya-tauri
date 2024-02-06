/**
 * Get the best font color depending on the background color.
 * 
 * Use black if returns `true`, or use white if returns `false`.
 * @param background Its format should follow `"#RRGGBB"`
 */
export function bestFontColor(background: string): boolean {
    const r = parseInt(background.slice(1, 3), 16);
    const g = parseInt(background.slice(3, 5), 16);
    const b = parseInt(background.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114 > 186);
}