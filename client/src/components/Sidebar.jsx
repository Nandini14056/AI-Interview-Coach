import {
  LayoutDashboard,
  History,
  BarChart2,
  Settings,
  Plus,
  Bot,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "interview History", icon: History, active: false },
    { name: "Performance Analytics", icon: BarChart2, active: false },
    { name: "Settings", icon: Settings, active: false },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
      {/*topsection*/}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">
              AI Interview <br />
              Coach
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Elevate Your Career
            </p>
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 mb-8 transition-colors shadow-sm">
          <Plus className="w-5 h-5"/>
          Start Interview
        </button>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
              key={item.name}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                item.active
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              >
                <Icon className={`w-5 h-5 ${item.active ? 'text-white': 'text-gray-400'}`}/>
                {item.name}
              </a>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
            {/* Using a placeholder avatar service for now */}
            <img 
              src="https://ui-avatars.com/api/?name=Alex+Developer&background=F3F4F6&color=4F46E5" 
              alt="Alex Developer" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-gray-900 truncate">Alex Developer</span>
            <span className="text-xs text-gray-500 truncate">alex@example.com</span>
          </div>
        </div>
      </div>
      
    </aside>
  );
};

export default Sidebar;
