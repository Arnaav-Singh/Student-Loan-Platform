// src/pages/Register.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner'; // Align with loan-service
import { ArrowLeft, UserPlus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loanService } from '@/services/loan-service';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    studentId: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      agreeTerms: checked,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      university: value,
    });
  };

  // src/pages/Register.tsx (partial)
// src/pages/Register.tsx (partial)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    !formData.university ||
    !formData.studentId
  ) {
    toast.error('Please fill in all fields.');
    return;
  }

  if (formData.password !== formData.confirmPassword) {
    toast.error('Passwords do not match.');
    return;
  }

  if (!formData.agreeTerms) {
    toast.error('You must agree to the terms and conditions.');
    return;
  }

  setIsLoading(true);

  try {
    const userData = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.studentId,
      password: formData.password,
      university: formData.university,
    };
    await loanService.register(userData); // Line ~102
    navigate('/dashboard');
  } catch (error: any) {
    console.error('Registration error:', error); // Line ~105
    toast.error(error.message || 'Unable to create your account. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const universities = [
    'State University',
    'Tech Institute',
    'City College',
    'Liberal Arts University',
    'Community College',
    'Medical University',
    'Other',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Sign up to start applying for student micro-loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Student Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@university.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Please use your university email for verification purposes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University/College</Label>
                  <Select
                    value={formData.university}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your institution" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map((university) => (
                        <SelectItem key={university} value={university}>
                          {university}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID Number</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="agreeTerms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      By signing up, you agree to our{' '}
                      <Link
                        to="/terms"
                        className="text-primary hover:underline"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        className="text-primary hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;