import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface FormData {
  paymentHistory: "excellent" | "good" | "fair" | "poor";
  creditUtilization: number;
  creditHistoryLength: number;
  creditMix: "limited" | "moderate" | "diverse";
  recentInquiries: number;
}

const CreditScoreCalculator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    paymentHistory: "excellent",
    creditUtilization: 10,
    creditHistoryLength: 3,
    creditMix: "limited",
    recentInquiries: 0,
  });
  const [creditScore, setCreditScore] = useState<number | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "recentInquiries" ? parseInt(value) : value,
    }));
  };

  const handleSliderChange = (name: keyof FormData, value: number[]) => {
    setFormData((prev) => ({ ...prev, [name]: value[0] }));
  };

  const calculateCreditScore = () => {
    let score = 300; // Base score

    // Payment History (35%)
    const paymentWeights: Record<string, number> = {
      excellent: 100,
      good: 80,
      fair: 50,
      poor: 20,
    };
    score += (paymentWeights[formData.paymentHistory] / 100) * 350 * 0.35;

    // Credit Utilization (30%)
    let utilizationScore = 0;
    if (formData.creditUtilization <= 30) utilizationScore = 100;
    else if (formData.creditUtilization <= 50) utilizationScore = 70;
    else if (formData.creditUtilization <= 75) utilizationScore = 40;
    else utilizationScore = 10;
    score += (utilizationScore / 100) * 350 * 0.30;

    // Length of Credit History (15%)
    let historyScore = 0;
    if (formData.creditHistoryLength >= 7) historyScore = 100;
    else if (formData.creditHistoryLength >= 4) historyScore = 70;
    else if (formData.creditHistoryLength >= 2) historyScore = 40;
    else historyScore = 20;
    score += (historyScore / 100) * 350 * 0.15;

    // Credit Mix (10%)
    const mixWeights: Record<string, number> = {
      diverse: 100,
      moderate: 60,
      limited: 30,
    };
    score += (mixWeights[formData.creditMix] / 100) * 350 * 0.10;

    // Recent Inquiries (10%)
    let inquiryScore = 0;
    if (formData.recentInquiries === 0) inquiryScore = 100;
    else if (formData.recentInquiries <= 2) inquiryScore = 70;
    else if (formData.recentInquiries <= 4) inquiryScore = 40;
    else inquiryScore = 20;
    score += (inquiryScore / 100) * 350 * 0.10;

    // Cap score at 850
    score = Math.min(Math.round(score), 850);
    setCreditScore(score);
  };

  const getScoreRange = (score: number): string => {
    if (score >= 800) return "Exceptional";
    if (score >= 740) return "Very Good";
    if (score >= 670) return "Good";
    if (score >= 580) return "Fair";
    return "Poor";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 mb-6">
                Estimate Your Credit Score
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Input your financial details to get an estimated credit score and understand your credit standing.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle>Credit Score Estimator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="paymentHistory">Payment History</Label>
                    <select
                      id="paymentHistory"
                      name="paymentHistory"
                      value={formData.paymentHistory}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="excellent">Excellent (No late payments)</option>
                      <option value="good">Good (Rare late payments)</option>
                      <option value="fair">Fair (Occasional late payments)</option>
                      <option value="poor">Poor (Frequent late payments or defaults)</option>
                    </select>
                  </div>

                  <div>
                    <Label>Credit Utilization (% of credit limit used)</Label>
                    <Slider
                      value={[formData.creditUtilization]}
                      onValueChange={(value) => handleSliderChange("creditUtilization", value)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <p className="mt-2 text-sm text-gray-600">{formData.creditUtilization}%</p>
                  </div>

                  <div>
                    <Label>Credit History Length (Years)</Label>
                    <Slider
                      value={[formData.creditHistoryLength]}
                      onValueChange={(value) => handleSliderChange("creditHistoryLength", value)}
                      max={20}
                      step={1}
                      className="mt-2"
                    />
                    <p className="mt-2 text-sm text-gray-600">{formData.creditHistoryLength} years</p>
                  </div>

                  <div>
                    <Label htmlFor="creditMix">Credit Mix</Label>
                    <select
                      id="creditMix"
                      name="creditMix"
                      value={formData.creditMix}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="limited">Limited (1-2 types, e.g., credit card only)</option>
                      <option value="moderate">Moderate (2-3 types, e.g., credit card, auto loan)</option>
                      <option value="diverse">Diverse (Multiple types, e.g., credit card, mortgage, auto loan)</option>
                    </select>
                  </div>

                  <div>
                    <Label>Recent Credit Inquiries (Last 12 months)</Label>
                    <Input
                      type="number"
                      name="recentInquiries"
                      value={formData.recentInquiries}
                      onChange={handleInputChange}
                      min="0"
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={calculateCreditScore} className="w-full">
                    Calculate Score
                  </Button>

                  {creditScore !== null && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-indigo-600">{creditScore}</h3>
                      <p className="text-lg">{getScoreRange(creditScore)}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        This is an estimate based on the provided information. Actual credit scores may vary.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center">Disclaimer</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              This credit score estimator provides an approximate score based on user input and simplified calculations. It does not use proprietary algorithms from FICO, VantageScore, or credit bureaus, nor does it access your actual credit report. For an accurate credit score, check with credit bureaus like Equifax, Experian, or TransUnion, or use services like Credit Karma or WalletHub.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply for a Loan?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Use your estimated credit score to explore loan options tailored for students with ScholarLoanHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Apply Now
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CreditScoreCalculator;