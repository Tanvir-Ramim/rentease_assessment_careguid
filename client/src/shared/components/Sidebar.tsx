import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineLogout } from "react-icons/hi";
import { TiArrowLeft } from "react-icons/ti";
import logo from "../../shared/assets/Logo.png";
import { navdata } from "../utils/contents";
import { logout } from "../utils/logout";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<HTMLButtonElement | null>(null);
  const sidebar = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebar.current && !sidebar.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`fixed left-0 top-0 z-50 flex h-screen w-52 flex-col bg-white shadow-xl duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex border-b border-gray-300 items-center justify-center px-2 py-5 relative">
        <div className="flex items-center gap-1">
          <img className="lg:w-full w-[50%]  " src={logo} alt="Logo" />
          <h1 className="sm:text-2xl text-lg font-bold ">RentEase</h1>
        </div>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute right-2 cursor-pointer text-2xl text-gray-600"
        >
          <TiArrowLeft size={30} />
        </button>
      </div>


      <div className="flex flex-1 items-center">
        <nav className="w-full px-4">
          <ul className="flex flex-col gap-2">
            {navdata?.map((item) => (
              <SidebarItem to={item.link} key={item.title} label={item.title} />
            ))}
          </ul>
        </nav>
      </div>

      <div className="px-4 pb-6">
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 cursor-pointer text-sm font-semibold text-red-600 hover:bg-red-100 transition"
        >
          <HiOutlineLogout className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

interface SidebarItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
  end?: boolean;
}

const SidebarItem = ({ to, icon, label, end }: SidebarItemProps) => (
  <li>
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {label}
    </NavLink>
  </li>
);
