import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Coins, CreditCard, Clock, Award, ShieldCheck, LightbulbIcon, BookText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const sections = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sections.current.map((section) => {
      if (!section) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade-in");
              if (entry.target.querySelector(".card-hover")) {
                entry.target.querySelectorAll(".card-hover").forEach((card) => {
                  card.classList.add("animate-slide-in");
                });
              }
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(section);
      return observer;
    });

    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          ref={(el) => (sections.current[0] = el)}
          className="bg-gradient-to-b from-white to-indigo-50 opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 mb-6">
                Financial Support for Your Academic Journey
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Access quick micro-loans designed specifically for students to cover educational and personal expenses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Benefits */}
        <section
          ref={(el) => (sections.current[1] = el)}
          className="py-16 bg-white opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Why Choose ScholarLoanHub?</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                We're committed to providing students with accessible financial solutions and tools to succeed.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardHeader>
                  <Clock className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Quick Processing</CardTitle>
                  <CardDescription>
                    Get your loan approved and disbursed promptly, often within 24-48 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our streamlined application process ensures you get the funds when you need them without unnecessary delays.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader>
                  <ShieldCheck className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Student-Friendly Terms</CardTitle>
                  <CardDescription>
                    Designed with student needs in mind, with flexible repayment options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    No hidden fees, transparent terms, and repayment schedules that work with your academic calendar.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader>
                  <Award className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Build Your Credit</CardTitle>
                  <CardDescription>
                    Establish and improve your credit score with each timely repayment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Start building your financial future while still in school with our credit-building program.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          ref={(el) => (sections.current[2] = el)}
          className="py-16 bg-gray-50 opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Get the financial support you need in just a few simple steps.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Register</h3>
                <p className="text-gray-600">
                  Create an account using your student credentials to verify your eligibility.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">
                  Fill out our simple loan application form specifying the amount and purpose.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Get Approved</h3>
                <p className="text-gray-600">
                  Receive a quick decision on your application, often within 24 hours.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary text-white text-2xl font-bold mb-4">4</div>
                <h3 className="text-xl font-semibold mb-2">Receive Funds</h3>
                <p className="text-gray-600">
                  Once approved, funds are disbursed directly to your designated account.
                </p>
              </div>
            </div>
            <div className="mt-12 text-center">
              <Link to="/register">
                <Button size="lg">Apply Now</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Loan Options */}
        <section
          ref={(el) => (sections.current[3] = el)}
          className="py-16 bg-white opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Loan Options</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the loan that best fits your needs and circumstances.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Quick Cash</CardTitle>
                  <CardDescription>For immediate, short-term expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹500</span>
                    <span className="text-gray-600 ml-2">max</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>30-day repayment term</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>No credit check required</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Same-day approval possible</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/apply" className="w-full">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="card-hover">
                <CardHeader className="bg-primary/5">
                  <div className="py-1 px-3 rounded-full bg-primary text-white text-xs font-medium inline-block mb-2">
                    Most Popular
                  </div>
                  <CardTitle>Term Loan</CardTitle>
                  <CardDescription>For medium-term educational expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹2,000</span>
                    <span className="text-gray-600 ml-2">max</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>3-6 month repayment terms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Minimal credit requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Lower interest rates available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Flexible payment schedule</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/apply" className="w-full">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Academic Year</CardTitle>
                  <CardDescription>For long-term educational support</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">₹5,000</span>
                    <span className="text-gray-600 ml-2">max</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>9-12 month repayment terms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Credit check required</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Lowest interest rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mr-2 mt-0.5" />
                      <span>Deferred payment options</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link to="/apply" className="w-full">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          ref={(el) => (sections.current[4] = el)}
          className="py-16 bg-gray-50 opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">What Students Say</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from students who have benefited from our micro-lending platform.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary">
                        JD
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">John Doe</h4>
                      <p className="text-sm text-gray-500">Engineering Student</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "ScholarLoanHub helped me purchase a new laptop when mine broke right before finals. 
                    The application was easy, and I got the funds within a day!"
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary">
                        JS
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Jane Smith</h4>
                      <p className="text-sm text-gray-500">Medical Student</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "As a medical student, unexpected expenses come up often. The Term Loan option 
                    gave me breathing room to focus on my studies instead of financial stress."
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardContent className="pt-8">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary">
                        RJ
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Robert Johnson</h4>
                      <p className="text-sm text-gray-500">Business Student</p>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">
                    "Not only did I get the financial support I needed, but the financial education 
                    resources helped me develop better money management skills."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section
          ref={(el) => (sections.current[5] = el)}
          className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Create an account today and take the first step toward accessing the funds you need for your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Account
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

        {/* Resources Section */}
        <section
          ref={(el) => (sections.current[6] = el)}
          className="py-16 bg-white opacity-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Educational Resources</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Improve your financial literacy with our educational resources.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="card-hover">
                <CardHeader className="pb-4">
                  <LightbulbIcon className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Budgeting Basics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Learn essential budgeting techniques specifically designed for student life.
                  </p>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://dfr.oregon.gov/financial/manage/pages/budget.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Read More</Button>
                  </a>
                </CardFooter>
              </Card>
              <Card className="card-hover">
                <CardHeader className="pb-4">
                  <CreditCard className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Credit Fundamentals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Understand how credit works and how to build a strong credit history.
                  </p>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://www.investopedia.com/terms/c/credit_score.asp#:~:text=A%20credit%20score%20is%20a%20number%20that%20depicts%20a%20consumer's,ve%20applied%20for%20new%20accounts."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Read More</Button>
                  </a>
                </CardFooter>
              </Card>
              <Card className="card-hover">
                <CardHeader className="pb-4">
                  <Coins className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Saving Strategies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Practical tips for saving money while navigating your academic journey.
                  </p>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://www.husson.edu/online/blog/2023/04/money-saving-tips-for-students"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Read More</Button>
                  </a>
                </CardFooter>
              </Card>
              <Card className="card-hover">
                <CardHeader className="pb-4">
                  <BookText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-lg">Loan Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Best practices for managing and repaying your student loans responsibly.
                  </p>
                </CardContent>
                <CardFooter>
                  <a
                    href="https://www.investopedia.com/articles/personal-finance/082115/10-tips-managing-your-student-loan-debt.asp"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">Read More</Button>
                  </a>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .animate-slide-in {
            animation: slideIn 0.8s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default Index;