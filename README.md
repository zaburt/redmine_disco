# Disco

A fun, dark disco-floor Redmine theme: midnight purple backgrounds, an
animated magenta/blue/cyan header, a scrolling rainbow light bar, glowing
menu pills and a mirror-ball logo. Animations are disabled when the browser
requests reduced motion.

## Installation

1. Clone this theme ([https://github.com/zaburt/redmine_disco](https://github.com/zaburt/redmine_disco)) into the Redmine `themes/`
   directory at the application root (Redmine 7+) as `disco`:

   ```
   git clone https://github.com/zaburt/redmine_disco.git themes/disco
   ```

   The result should contain:

   ```
   themes/disco/stylesheets/application.css
   ```

   > Note: Redmine 6 and earlier used `public/themes/` instead of `themes/`.

2. Restart Redmine. In production, precompile assets:

   ```
   RAILS_ENV=production bin/rails assets:precompile
   ```

3. Go to `Administration -> Settings -> Display` and select "Disco"
   in the "Theme" drop-down list.

## Customize

1. Change `images/logo.svg` for the header/login logo and
   `favicon/favicon.svg` for the browser tab icon.
2. The palette is defined as hex values in `stylesheets/application.css`
   (the "Disco layer" at the end holds the animations):

   | Role               | Color     |
   |--------------------|-----------|
   | Midnight (bg)      | `#14081F` |
   | Panel              | `#241035` / `#2E1545` |
   | Hot magenta        | `#FF2BD6` |
   | Electric blue      | `#2B6BFF` |
   | Cyan (links)       | `#27F0FF` |
   | Gold (selected)    | `#FFC933` |
   | Lime (success)     | `#B6FF3B` |
   | Text / muted       | `#F4E9FF` / `#B79BD6` |
3. In production, re-run `assets:precompile` after editing any theme file.

## License

Licensed under [GNU GPLv2](LICENSE).

Copyright (c) 2026 Onur Küçük (onur [at] delipenguen.net)
