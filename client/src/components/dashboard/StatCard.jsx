const StatCard = ({ title, Icon, children}) =>{
  return (
    <div className="bg-white rounded-xl p-5 border-gray-200 shadow-sm flex flex-col justify-between hover:border-gray-400 transition-all">

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
        {Icon && <Icon className="w-4 h-4 text-gray-400"/>}
      </div>

      <div>
        {children}
      </div>
    </div>
  )
};

export default StatCard;