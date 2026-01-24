document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.control-sidebar');
    
    if (sidebar) {
        // 1. CREATE CROSS (CLOSE) BUTTON
        const closeBtn = document.createElement('a');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        
        // Button Styling (Orange Cross)
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            color: #ff9f1c;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 10000;
            transition: transform 0.2s;
        `;
        
        // Hover Effect
        closeBtn.onmouseover = function() { this.style.transform = "scale(1.2)"; };
        closeBtn.onmouseout = function() { this.style.transform = "scale(1)"; };

        // Add Button to Sidebar
        sidebar.prepend(closeBtn);

        // 2. CLOSE BUTTON LOGIC
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeSidebar();
        });

        // 3. CLICK OUTSIDE TO CLOSE LOGIC
        document.addEventListener('click', function(e) {
            // Agar click sidebar ke andar NAHI hai, aur Toggle button par bhi NAHI hai
            const isClickInside = sidebar.contains(e.target);
            const isToggleBtn = e.target.closest('[data-widget="control-sidebar"]');
            
            // Check if sidebar is currently open
            const isOpen = document.body.classList.contains('control-sidebar-slide-open') || 
                           document.body.classList.contains('control-sidebar-open');

            if (isOpen && !isClickInside && !isToggleBtn) {
                closeSidebar();
            }
        });

        // Helper Function to Close
        function closeSidebar() {
            document.body.classList.remove('control-sidebar-slide-open');
            document.body.classList.remove('control-sidebar-open');
        }
    }
});