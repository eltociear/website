# The Real Flickering Fix - Disable Hover Preloading

## Root Cause Found

The console logs show the real problem:
```
Loading framework navigation translations...
🔍 Loading: en/framework.json for dataKey: framework
✅ Loaded framework translations for locale: en
Checking page-specific translations for route: /frameworks/aurora-accord
```

**Every hover triggers translation loading** because of `data-sveltekit-preload-data="hover"` on links.

## The Real Fix

### Option 1: Remove Hover Preloading (Recommended)

Search for `data-sveltekit-preload-data="hover"` in Header.svelte and change to `data-sveltekit-preload-data="tap"`:

**Find and replace**:
```html
<!-- BEFORE -->
data-sveltekit-preload-data="hover"

<!-- AFTER -->
data-sveltekit-preload-data="tap"
```

This will preload only on click/tap, not on hover.

### Option 2: Remove All Preloading

If you want maximum performance, remove the attribute entirely:

**Find and replace**:
```html
<!-- BEFORE -->
<a href="{base}/frameworks/something" data-sveltekit-preload-data="hover">

<!-- AFTER -->
<a href="{base}/frameworks/something">
```

## How to Apply

### Using Find & Replace

1. Open `src/lib/components/Header.svelte`
2. Press Ctrl+H (or Cmd+H on Mac)
3. Find: `data-sveltekit-preload-data="hover"`
4. Replace: `data-sveltekit-preload-data="tap"` (or leave empty to remove)
5. Replace All
6. Save

### Using sed (Linux/Mac)

```bash
# Backup first
cp src/lib/components/Header.svelte src/lib/components/Header.svelte.backup

# Change hover to tap
sed -i 's/data-sveltekit-preload-data="hover"/data-sveltekit-preload-data="tap"/g' src/lib/components/Header.svelte

# Or remove entirely
sed -i 's/ data-sveltekit-preload-data="hover"//g' src/lib/components/Header.svelte
```

## Why This Works

**Before**:
1. Mouse hovers over link
2. SvelteKit preloads the page data
3. Translation system loads framework-specific translations
4. Multiple async operations fire
5. Console logs spam
6. UI flickers

**After** (with "tap"):
1. Mouse hovers over link
2. Nothing happens (smooth)
3. User clicks link
4. Then preloading happens
5. No flickering during hover

**After** (with removed):
1. Mouse hovers over link
2. Nothing happens (smooth)
3. User clicks link
4. Page loads normally
5. Slightly slower navigation but no flickering

## Performance Impact

| Method | Hover Performance | Navigation Speed |
|--------|------------------|------------------|
| hover (current) | ❌ Flickering | ✅ Instant |
| tap | ✅ Smooth | ✅ Very fast |
| removed | ✅ Smooth | ⚠️ Normal |

**Recommendation**: Use "tap" for best balance.

## Additional Optimizations

If you still see some issues, also apply:

### 1. The IIFE fix (you already did this)
Keep the corrected IIFE fix for `frameworksByTier`.

### 2. The other component fixes
- [precomputedFrameworkDatabase-fixed.js](computer:///mnt/user-data/outputs/precomputedFrameworkDatabase-fixed.js)
- [FrameworkSidebar-fixed.svelte](computer:///mnt/user-data/outputs/FrameworkSidebar-fixed.svelte)

### 3. Reduce console logging

If the console spam is slowing things down, you can disable debug logging in your i18n system (usually in `src/lib/i18n/index.js`).

Look for lines like:
```javascript
console.log('Loading framework navigation translations...');
console.log('✅ Loaded framework translations for locale:', locale);
```

Comment them out or wrap in:
```javascript
if (import.meta.env.DEV && false) { // Disable even in dev
  console.log('...');
}
```

## Testing

After changing to "tap":

1. Reload the page
2. Hover over Framework menu items
3. **Expected**: No console logs, smooth hover
4. Click a link
5. **Expected**: Page loads quickly

## Summary

The flickering was NOT caused by the `frameworksByTier` calculation (though that fix is still good).

The flickering was caused by **SvelteKit preloading translations on every hover**.

**The fix**: Change `data-sveltekit-preload-data="hover"` to `"tap"` or remove it.

**Result**: Smooth hovering, no flickering, fast navigation.
