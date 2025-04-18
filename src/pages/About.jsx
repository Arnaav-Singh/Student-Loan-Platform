import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import image from "../pages/assets/Manan.jpeg"
const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 mb-6">
                About ScholarLoanHub
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                We're dedicated to empowering students by providing accessible micro-loans to support their educational journey.
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

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                To bridge the financial gap for students by offering quick, transparent, and student-friendly micro-loans, enabling them to focus on their education without financial stress.
              </p>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Founders</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                The visionaries behind ScholarLoanHub, committed to transforming student financial support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white">
                <CardContent className="pt-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary overflow-hidden">
                      <img
                        src=""
                        alt="Manan Sethi"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg">Manan Sethi</h4>
                  <p className="text-sm text-gray-500">Co-Founder</p>
                  <p className="text-gray-600 mt-4">
                    Manan is passionate about creating financial solutions that empower students to achieve their academic goals without the burden of financial constraints.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white">
                <CardContent className="pt-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-semibold text-primary overflow-hidden">
                      <img
                        src="https://via.placeholder.com/150"
                        alt="Dhruveel Sha"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg">Dhruveel Sha</h4>
                  <p className="text-sm text-gray-500">Co-Founder</p>
                  <p className="text-gray-600 mt-4">
                    Dhruveel is driven to innovate in the financial sector, ensuring students have access to transparent and flexible funding options tailored to their needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide us in supporting students on their academic journey.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in clear, honest communication with no hidden fees or surprises, ensuring students understand every aspect of their loan.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our platform is designed to be inclusive, providing financial support to students from all backgrounds with minimal barriers.
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Empowerment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We empower students by offering not just loans but also financial education to help them build a strong financial future.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Become a part of ScholarLoanHub and access the financial support you need to succeed in your education.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto">
                  Contact Us
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

export default About;