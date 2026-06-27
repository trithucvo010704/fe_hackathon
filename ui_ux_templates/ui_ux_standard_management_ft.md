# Standard Management Feature UI/UX Specification

This document defines the standard UI/UX patterns for management features (CRUD) within the EziOps platform. Use this as a reference to maintain consistency across all administrative and project management modules.

## 1. Core Layout Structure
All management pages follow a single-container layout with clear separation of Header, Toolbar, and Data Table.

- **Container**: `white` background, `16px` border-radius, `32px` padding, subtle `box-shadow`, and `1px solid #e2e8f0` border.
- **Animation**: `fadeIn` animation (opacity 0 -> 1, translateY 10px -> 0) with `0.4s` duration.

## 2. Header Section
Located at the top of the container.
- **Title**: Large font (`1.875rem`), weight `800`, color `#1e293b`.
- **Primary Action**: "Create" button on the right.
    - **Style**: Solid background (`#3b82f6`), `12px` padding, `12px` border-radius, weight `700`.
    - **Effect**: Subtle `translateY(-2px)` and shadow increase on hover.

## 3. Toolbar Section
A horizontal bar for filtering and searching.
- **Search Bar**: 
    - Left-aligned, icon-prefixed.
    - Input: `f8fafc` background, `1.5px` border, `14px` border-radius.
- **Dropdown Filters**: 
    - Consistent style with search bar.
    - Label prefixed (e.g., "Provider: OpenAI").
- **Status Tabs**:
    - Segmented control style.
    - `f1f5f9` background container with `4px` padding.
    - Active tab has white background and shadow.

## 4. Data Table
The central component for displaying information.
- **Header**: `f8fafc` background, uppercase text, weight `800`, letter-spacing `0.05em`.
- **Rows**: 
    - Padding `20px`.
    - Subtle background change on hover.
- **Key/ID Column**: High contrast color (`#3b82f6`), weight `700`, monospace font if applicable.
- **Main Info**: Title in weight `700`, color `#1e293b`.
- **Status Badges**:
    - Rounded corners (`10px`).
    - Color-coded: `Active` (Green), `Inactive` (Red), `In Progress` (Blue), `Done` (Emerald).
    - Includes a small status dot.
- **Metadata Badges**: Subtle gray/blue backgrounds for categories or providers.

## 5. Actions & Navigation
- **Action Menu**: Buttons for Edit (`Edit2` icon) and Delete (`Trash2` icon).
    - Buttons have `10px` border-radius and transition to primary or danger colors.
- **Pagination**: 
    - Summary text on the left ("Showing X-Y of Z").
    - Navigation controls on the right (Square buttons with icons or numbers).

## 6. Form Modals (Detailed Styles)
Standardized dialogs for Create and Update operations. These styles should be applied to forms inside the `Modal` component.

- **Structure**:
    - `.project-form`: Main container with `20px` gap and `24px` internal padding.
    - `.form-group`: Vertical stack (Label + Input) with `8px` gap.
    - `.form-row`: `2-column` grid for related inputs (e.g., Provider and Status).
- **Inputs & Controls**:
    - Background: `#f8fafc` (very light gray).
    - Border: `1px solid #e2e8f0`.
    - Focus: Blue border (`#3b82f6`) with a `4px` soft glow shadow.
    - Selects: Consistent padding and border with text inputs.
- **Form Actions**:
    - Container (`.form-actions`): Bottom-aligned, right-justified, with a top separator line.
    - Buttons:
        - **Primary (`.btn-primary`)**: Solid Blue (`#3b82f6`), white text, bold.
        - **Secondary (`.btn-secondary`)**: White background, gray border/text, blue on hover.

---

### Reference CSS Classes (CSS Modules)
Include these in your `management.module.css` with `:global()` prefix where necessary:
- `.storyManagement`: Main page container.
- `.storyHeader`: Page header.
- `.storyToolbar`: Filter bar.
- `.storyTableContainer` & `.storyTable`: Data display.
- `.project-form`, `.form-group`, `.form-row`: Form layout.
- `.btn-primary`, `.btn-secondary`: Standardized buttons.
- `.form-actions`: Footer button container.
