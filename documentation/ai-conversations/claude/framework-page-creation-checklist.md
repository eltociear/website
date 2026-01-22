## Framework Page Creation Checklist

When creating a new framework page based on an existing one:

**1. Translation Structure**
- JSON files should NOT have the framework wrapper key (e.g., don't wrap in `hearthlightFramework`)
- The `index.js` route mapping provides the wrapper automatically via `dataKey`
- Include both `categories` (for navigation groups) and `sections` (for individual section titles)

**2. i18nPageObject Setup**
- Must spread the framework translation object: `$derived({...frameworkTranslations, sectionIcons: {...}})`
- Never assign just a subset like `frameworkTranslations?.page || {}`
- This ensures FrameworkLayout gets access to `sections` and `categories` mappings

**3. Content Structure**
- Use `<div class="section-container">` for regular framework sections
- Wrap content in `<div class="section-content"><div class="content">`
- Don't add custom CSS - FrameworkLayout provides all styling
- Follow the exact pattern from Treaty's else block for non-quickstart sections

**4. Quick Check**
- If section names show as file names instead of translated titles → fix i18nPageObject
- If markdown isn't styled → check section container structure
- If translations don't load → verify JSON structure and route mapping

This pattern ensures proper section titles, markdown styling, and translation loading.
