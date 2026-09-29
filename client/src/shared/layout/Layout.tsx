import { useState } from "react";

import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
        {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          /> */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-3 md:p-8 min-h-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
