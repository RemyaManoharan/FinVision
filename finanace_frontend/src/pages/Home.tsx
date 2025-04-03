import { Link } from "react-router-dom";
import BackgroundSVG from "../components/svg/Homebackground";
import ChartSVG from "../components/svg/Chartsvg";
import KeyFeatures from "../components/KeyFeatures";

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Geometric background elements */}
      <div className="geometric-shape geometric-triangle w-96 h-96 top-20 -right-20 rotate-45"></div>
      <div className="geometric-shape geometric-diamond w-96 h-96 -bottom-20 -left-20"></div>
      {/* Abstract blue lines background   */}
      <div className="absolute inset-0 z-[-20]">
        <BackgroundSVG />
      </div>
      {/* Main content  */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold">
              Start taking control of your finance & life
            </h1>
            <p className="text-lg md:text-xl max-w-xl">
              Take charge of your finances with our comprehensive tools for
              expense tracking, budgeting, and financial analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/signup"
                className="btn btn-primary px-8 py-3 text-base"
              >
                Get Started
              </Link>
              <Link
                to="/features"
                className="btn btn-outline px-8 py-3 text-base"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">
              Financial Dashboard Preview
            </h3>
            {/* Sample Dashboard Chart */}
            <div className="aspect-video bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-lg flex items-center justify-center border border-blue-500/20">
              <ChartSVG />
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mt-24">
          <KeyFeatures />
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready for financial transformation?
          </h2>
          <Link
            to="/signup"
            className="btn btn-primary px-8 py-3 text-base inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
