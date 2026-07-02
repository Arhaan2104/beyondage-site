# Brand fonts

The brand identity uses two **licensed** faces. They are intentionally not
committed to the repo (you must hold a valid web licence). Until the `.woff2`
files are placed here, the site renders in a classy system fallback
(Iowan/Palatino serif + native UI sans) — never an AI-slop Google webfont.

## Installing the licensed faces

1. Drop the web `.woff2` files into this folder, e.g.

   ```
   public/fonts/Signifier-Regular.woff2
   public/fonts/Signifier-Light.woff2
   public/fonts/ABCDiatype-Regular.woff2
   public/fonts/ABCDiatype-Medium.woff2
   ```

2. Add the `@font-face` rules to `src/app/globals.css` (top of file), e.g.

   ```css
   @font-face {
     font-family: "Signifier";
     src: url("/fonts/Signifier-Regular.woff2") format("woff2");
     font-weight: 400;
     font-display: swap;
   }
   @font-face {
     font-family: "ABC Diatype";
     src: url("/fonts/ABCDiatype-Regular.woff2") format("woff2");
     font-weight: 400;
     font-display: swap;
   }
   ```

3. Nothing else changes — `--font-display-licensed` / `--font-text-licensed`
   in `globals.css` already name these families first in the stack.

> Swapping to a different licensed face later = change those two CSS variables.
> The display face is the brand's voice; pick it deliberately.
