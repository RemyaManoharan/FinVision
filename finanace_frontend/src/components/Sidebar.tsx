import React, { useState } from 'react';
import { 
  MdDashboard, 
  MdInsights, 
  MdReceipt, 
  MdAccountBalance, 
  MdStorage,
  MdMenu,
  MdClose,
  MdChevronLeft
} from 'react-icons/md';

// Define the type for sidebar items
interface SidebarItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

// Icon class from your styling
const ICON_CLASS = "w-6 h-6";

// Sidebar items array
const sidebar_items: SidebarItem[] = [
  { 
    id: 0, 
    title: 'Dashboard',
    icon: <MdDashboard className={ICON_CLASS} />,
    component: (<div>User Home Page</div>),
  },
  { 
    id: 1, 
    title: 'Analytics',
    icon: <MdInsights className={ICON_CLASS} />,
    component: (<div>Analytics Page</div>),
  },
  { 
    id: 2, 
    title: 'Transactions',
    icon: <MdReceipt className={ICON_CLASS} />,
    component: (<div>Transactions Page</div>),
  },
  { 
    id: 3, 
    title: 'Budgeting',
    icon: <MdAccountBalance className={ICON_CLASS} />,
    component: (<div>Budgeting Page</div>),
  },
  { 
    id: 4, 
    title: 'Data',
    icon: <MdStorage className={ICON_CLASS} />,
    component: (<div>Data Management Page</div>),
  },
];

interface SidebarProps {
  onTabChange?: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTabChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300duration-300 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] relative `}>
        {/* Mobile Toggle Button */}
        <div className="lg:hidden p-4 flex justify-end">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-indigo-600"
          >
            {isOpen ? <MdClose className="w-5 h-5" /> : <MdMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex flex-col space-y-1 p-2">
          {sidebar_items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(index)}
              className={`flex items-center p-3 rounded-md transition-colors ${
                selectedTab === index 
                  ? 'bg-[rgb(var(--color-primary))/0.1] text-[rgb(var(--color-primary))]'
                  : 'text-white hover:bg-[rgb(var(--color-card-hover))] hover:text-[rgb(var(--color-foreground))]'
              } ${!isOpen && 'justify-center'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {isOpen && <span className="ml-3">{item.title}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Collapse Button - Now positioned correctly at the bottom */}
      {/* <div className={`${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-indigo-800 border-t border-[rgb(var(--color-border))]`}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-center text-white hover:bg-indigo-900 transition-colors"
        >
          {isOpen ? (
            <>
              <span className="mr-2">Collapse</span>
              <MdChevronLeft className="w-5 h-5" />
            </>
          ) : (
            <MdMenu className="w-5 h-5" />
          )}
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;