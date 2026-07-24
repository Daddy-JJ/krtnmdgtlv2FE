# ThemePicker

ThemePicker reads `frontend/config/theme-registry.json`.

## User controls

- Starter sees one selectable theme.
- Basic sees Starter plus two Basic themes.
- Pro sees all ten themes.
- Orientation filter is visible for Pro.
- Locked themes show required plan and Upgrade action.
- Selecting a theme updates live preview.
- Saving writes `cards.theme_code`.
- Server remains authoritative and rejects inaccessible themes.

## Events

- `theme:selected`
- `theme:previewed`
- `theme:saved`
- `theme:locked-selected`
