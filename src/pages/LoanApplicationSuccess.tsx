
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LoanApplicationSuccess = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ensure the user came from the application page, otherwise redirect to dashboard
    const hasApplied = localStorage.getItem("loanApplications");
    
    if (!hasApplied) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-8">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your loan application. We've received your information and will begin processing it right away.
          </p>
          
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-lg mb-4">What happens next?</h2>
            <ol className="text-left space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">1</span>
                <span>Our team will review your application (typically within 24-48 hours).</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">2</span>
                <span>You'll receive a notification when your application status changes.</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium mr-3 flex-shrink-0">3</span>
                <span>If approved, funds will be disbursed to your designated account.</span>
              </li>
            </ol>
          </div>
          
          <div className="space-y-4">
            <Link to="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full">Return to Home</Button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">
            Have questions? Contact our support team at{" "}
            <a href="mailto:support@scholarloan.com" className="text-primary hover:underline">
              support@scholarloan.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoanApplicationSuccess;
