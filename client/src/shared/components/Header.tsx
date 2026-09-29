import { Link } from "react-router-dom";
import logo from "../../shared/assets/Logo copy.png";
import { LuSquareMenu } from "react-icons/lu";

import { useState, useEffect, useRef } from "react";


const Header = ({
  setSidebarOpen,
  sidebarOpen,
}: {
  setSidebarOpen: (value: boolean) => void;
  sidebarOpen: boolean;
}) => {
  const now = new Date();
  const hours = now.getHours();

  const getGreeting = () => {
    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    if (hours >= 17 && hours < 21) return "Good Evening";
    return "Good Night";
  };

  const formattedDate = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [profileOpen, setProfileOpen] = useState(false);


  const profileRef = useRef<HTMLDivElement>(null);

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full bg-white shadow-black/5 shadow lg:px-9 md:px-6 px-3 pt-4 pb-3 z-50">
      <div className="flex items-center max-w-475 mx-auto justify-between">
        {/* Left */}
        <div className="flex items-center">
          <div className="lg:flex flex-col hidden">
            <h1 className="text-lg font-semibold text-gray-800">
              {getGreeting()} <span className="font-bold">Admin</span>
            </h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
            <button
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={(e) => {
                e.stopPropagation();
                setSidebarOpen(!sidebarOpen);
              }}
              className="z-99999 block cursor-pointer rounded-sm bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
            >
              <LuSquareMenu size={25} />
            </button>

            <Link className="block pl-1.5 shrink-0 lg:hidden" to="/">
              <img src={logo} alt="Logo" className="w-28" />
            </Link>
          </div>
        </div>

        {/* Right Desktop */}
        <div className="hidden xl:flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="cursor-pointer">
              {/* <IconSvg
                name={"notification"}
                className="w-6 h-5 text-gray-600"
              /> */}
              
            </div>

            <div className="h-8 w-px bg-gray-300"></div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="leading-tight font-medium">
                admin@gmail.com
                <p className="text-xs mt-0.5 pt-1 text-gray-500">Admin</p>
              </div>
              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-9 h-9 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Mobile */}
        <div className="flex xl:hidden items-center gap-4">
          <div className="mt-1.5 cursor-pointer">
            {/* <IconSvg
              name={"notification"}
              className="w-6 h-5 text-gray-600"
            /> */}
          </div>

          <button className="cursor-pointer" onClick={toggleProfile}>
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="h-7 w-7 rounded-full border border-[#CDCFD2] object-cover"
            />
          </button>
        </div>
      </div>

      {/* Profile Dropdown Mobile */}
      <div
        ref={profileRef}
        className={`xl:hidden absolute left-0 top-full w-full bg-white shadow-md z-40 transition-all duration-300 ${
          profileOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-3 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 p-4">
          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="profile"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="leading-tight mt-1">
              Tanvir Hossan <span className="text-xs">(Developer)</span>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
