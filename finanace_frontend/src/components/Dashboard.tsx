import React from 'react'

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - left column */}
      <div className="w-64 border-r border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))]">
        {/* Sidebar content will go here */}
      </div>
      
      {/* Main content - right column */}
      <div className="flex-1 overflow-auto p-6">
        {/* Dashboard content will go here */}
      </div>
    </div>
  )
}

export default Dashboard
