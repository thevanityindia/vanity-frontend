# Admin Sidebar & Real-Time Stats Update

I have implemented the requested "Real-time numbers" and "Full Redesign" for the Admin Sidebar.

### 1. **Real-Time Data Integration**
- **AdminLayout.jsx**: Now acts as the central data hub for global admin stats.
    - **Fetches 3 key metrics** every 30 seconds:
        1. **Pending Orders**: Count of orders requiring attention.
        2. **Low Stock Inventory**: Count of products running low.
        3. **Unread Notifications**: Count of unseen system alerts.
    - Passes these dynamic counts to the Sidebar.

### 2. **AdminSidebar.jsx (Redesign)**
- **Structure**: Grouped navigation items into logical sections (Store Management, Customer, Analysis).
- **Dynamic Badges**: Now displays the *real* numbers passed from the layout.
    - **Orders Badge**: Red (`important`) for immediate attention.
    - **Inventory Badge**: Yellow (`warning`) for stock alerts.
    - **Notifications Badge**: Blue (`info`) for updates.
    - **Visuals**: Badges are now pill-shaped and clearer.

### 3. **Visual Overhaul (CSS)**
- **Premium Dark Theme**: Switched to a deep slate/navy background (`#0f172a`) to give a professional, premium application feel.
- **Brand Identity**: Added a styled logo area with a gradient background.
- **Active States**: Modern active item styling with a subtle blue gradient and left-border accent.
- **Typography**: Improved spacing, font sizes, and section headers.

### **How to Verify**
1. **Admin Panel**: Log in and observe the sidebar.
2. **Real-Time Check**:
    - If you have 0 Pending Orders, the badge should disappear or show nothing.
    - Mark a notification as read in the header -> expect the Sidebar count to update on the next poll (30s) or refresh.
3. **Responsive**: Collapse the sidebar to see the compact "Dot" badges for status.

This resolves the issue of "showing number" when there are no actual items, as the logic `badges?.orders > 0` ensures badges only appear when necessary.
