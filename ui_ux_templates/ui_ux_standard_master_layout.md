# Master Layout UI/UX Specification

This document defines the core structural layout and global navigation patterns for the EziOps platform. It ensures a consistent "frame" for all functional modules.

## 1. Overall Structure
The Master Layout is a responsive two-part system consisting of a fixed Sidebar and a dynamic Main Content area.

- **Background**: `var(--background)` or light gray (`#f8fafc`).
- **Responsive Behavior**: 
    - **Desktop**: Sidebar is persistent on the left.
    - **Mobile**: Sidebar is hidden by default and toggled via a hamburger menu in the Header, accompanied by a semi-transparent overlay.

## 2. Global Sidebar (Navigation)
The primary navigation hub, located on the left.
- **Header**: Contains the application logo (`Cpu` icon) and name ("AgentOps" or "EziOps").
- **Navigation Groups**: Items are grouped into logical sections (e.g., General, Administration).
    - **Nav Items**: Icon + Text. 
    - **Active State**: Highlighted background (`#eff6ff`), blue text (`#3b82f6`), and bold weight.
    - **Hover State**: Subtle background change.
- **Collapsible Sections**: Advanced management items (e.g., Admin Management) are grouped in collapsible menus with `ChevronDown` / `ChevronRight` indicators.
- **Footer (Profile)**: Displays the current user's avatar (DiceBear SVG), name, and role. Includes a prominent `LogOut` button.

## 3. Global Header (Actions)
A horizontal bar at the top of the Main Content area.
- **Menu Toggle**: A hamburger menu button (`Menu` icon) visible only on mobile/tablet viewports.
- **Global Search**: A centered or left-aligned search bar with a `Search` icon.
    - Style: Integrated look with `var(--text-muted)` placeholder.
- **Global Actions**: Group of icons on the right:
    - **Notifications**: `Bell` icon with a red dot badge for pending alerts.
    - **Help**: `HelpCircle` icon for documentation or support.
    - **Theme Toggle**: `Moon`/`Sun` icon for switching between light and dark modes.

## 4. Main Content Area
The flexible area where functional modules (pages) are rendered.
- **Padding**: Default padding of `24px` on all sides (configured via `DashboardLayout`).
- **Content Flow**: Vertical scrolling for long pages while the Sidebar and Header remain fixed (sticky) or relative depending on viewport size.

## 5. Visual Consistency
- **Icons**: Standardized using `lucide-react` with a consistent size (typically `20px` for nav, `18px` for header actions).
- **Typography**: Clean, sans-serif font (Inter or system default) with varying weights for hierarchy.
- **Colors**: Relying on CSS variables (e.g., `var(--primary)`, `var(--secondary)`, `var(--border)`) to support theme consistency.

---

### Reference Components
- `DashboardLayout`: The wrapper component.
- `Sidebar`: Left navigation component.
- `Header`: Top action bar component.
- `LayoutContext`: Context provider for managing sidebar/theme states.
