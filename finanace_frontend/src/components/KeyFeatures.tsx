import React from "react";

const KeyFeatures = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Dashboard with KPIs</h3>
          <p>
            Get a complete overview of your financial health with our
            comprehensive dashboard.
          </p>
        </div>

        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Expense Tracking</h3>
          <p>
            Track all your expenses easily and see where your money is going.
          </p>
        </div>

        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Budgeting</h3>
          <p>Create and manage budgets to keep your spending in check.</p>
        </div>

        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Visual Analytics</h3>
          <p>See visual comparisons of your income and spending patterns.</p>
        </div>

        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Transactions</h3>
          <p>
            Record and categorize all your financial transactions in one place.
          </p>
        </div>

        <div className="card hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-medium mb-2">Advanced Analytics</h3>
          <p>
            Get deeper insights into your financial behavior with advanced
            analytics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyFeatures;
