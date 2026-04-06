---
name: Custom Styles
styles:
  - /custom_style.css
---

# Custom Styles

:::alert{warn}
Custom styles are best used with `allowDangerousHtml` enabled. It is highly recommanded to not style rrennAIbook elements and to only style custom elements. The classes we use for the rrennAIbook are not considered stable and might change in the future. Therefore, style rrennAIbook elements only with caution.
:::

```md title="Frontmatter"
styles:
  - /custom_style.css
```

```css title="custom_style.css
.custom {
	color: red;
	font-size: 3rem;
}
```

<div class="custom">I am styled!</div>
