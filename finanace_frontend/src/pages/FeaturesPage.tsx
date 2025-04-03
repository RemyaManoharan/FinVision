import { Link } from "react-router-dom";
import BackgroundSVG from "../components/svg/Homebackground";
import KeyFeatures from "../components/KeyFeatures";

const Features = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Geometric background elements */}
      <div className="geometric-shape geometric-triangle w-96 h-96 top-20 -right-20 rotate-45"></div>
      <div className="geometric-shape geometric-diamond w-96 h-96 -bottom-20 -left-20"></div>
      {/* Abstract blue lines background */}
      <div className="absolute inset-0 z-[-20]">
        <BackgroundSVG />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Our Features</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Explore our comprehensive suite of tools designed to help you take
            control of your finances and build a better financial future.
          </p>
        </div>

        {/* Key Features Section */}
        <div className="mb-16">
          <KeyFeatures />
        </div>

        {/* Detailed Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Detailed Features
          </h2>

          <div className="space-y-12">
            <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-2xl font-medium mb-4">Dashboard with KPIs</h3>
              <p className="mb-4">
                Our dashboard gives you a comprehensive overview of your
                financial health at a glance.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Net worth tracking</li>
                <li>Monthly income vs. expense comparison</li>
                <li>Budget adherence metrics</li>
                <li>Savings rate calculation</li>
                <li>Customizable KPIs that matter to you</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-2xl font-medium mb-4">Expense Tracking</h3>
              <p className="mb-4">
                Keep track of every penny with our powerful expense tracking
                system.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Categorize expenses automatically</li>
                <li>Track recurring expenses</li>
                <li>Split expenses between categories</li>
                <li>Tag expenses for detailed filtering</li>
                <li>Receipt scanning and storage</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-2xl font-medium mb-4">Budgeting</h3>
              <p className="mb-4">
                Create and manage budgets to keep your spending in check and
                achieve your financial goals.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create category-based budgets</li>
                <li>Set up monthly, quarterly, or annual budgets</li>
                <li>Roll over unused budget amounts</li>
                <li>Get alerts when approaching budget limits</li>
                <li>Adjust budgets based on actual spending patterns</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to experience these features?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
            <Link to="/signup" className="btn btn-primary px-8 py-3 text-base">
              Sign Up Now
            </Link>
            <Link to="/" className="btn btn-outline px-8 py-3 text-base">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
