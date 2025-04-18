import { useState, useEffect, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, HelpCircle, InfoIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-client';

const LoanApplication = () => {
  const [formData, setFormData] = useState({
    loanType: '',
    loanAmount: 500,
    purpose: '',
    duration: '30',
    employmentStatus: '',
    monthlyIncome: '',
    housingStatus: '',
    termsAgreed: false,
    otherLoans: 'no',
    willUseForEducation: true,
  });
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Authentication check
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!userStr || !isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Please log in to apply for a loan.',
      });
      navigate('/login');
    } else {
      const user = JSON.parse(userStr);
      if (!user.customer_id) {
        toast({
          variant: 'destructive',
          title: 'Invalid User Data',
          description: 'Please re-register to continue.',
        });
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        navigate('/register');
      }
    }
  }, [navigate, toast]);

  // Fetch loan types
  const { data: loanTypes, isLoading: loanTypesLoading, error: loanTypesError } = useQuery({
    queryKey: ['loanTypes'],
    queryFn: async () => {
      const response = await apiService.getLoanTypes();
      return response.data;
    },
    retry: 2,
  });

  // Mutation for submitting loan application
  const applyLoanMutation = useMutation({
    mutationFn: async (loanData: {
      customerId: number;
      roomTypeId: number;
      startDate: string;
      endDate: string;
      purpose: string;
      amount: number;
      employmentStatus: string;
      monthlyIncome: string;
      housingStatus: string;
      termsAgreed: boolean;
      otherLoans: string;
      educationalPurpose: boolean;
    }) => {
      const response = await apiService.createLoan(loanData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboardData'] });
      toast({
        title: 'Loan Application Submitted',
        description: 'Your loan application has been submitted successfully.',
      });
      navigate('/dashboard');
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'Failed to submit loan application.',
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRadioChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({
      ...formData,
      loanAmount: value[0],
    });
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const validateStep1 = () => {
    if (!formData.loanType || !formData.purpose) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.employmentStatus || !formData.monthlyIncome || !formData.housingStatus) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
      });
      return false;
    }
    const income = parseFloat(formData.monthlyIncome);
    if (isNaN(income) || income < 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Income',
        description: 'Please enter a valid monthly income.',
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.termsAgreed) {
      toast({
        variant: 'destructive',
        title: 'Terms Agreement Required',
        description: 'You must agree to the terms and conditions to proceed.',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;

    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not found. Please log in again.',
      });
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.customer_id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Customer ID not found. Please re-register.',
      });
      navigate('/register');
      return;
    }

    // FIX: Use .name instead of .type
    const loanType = loanTypes?.find((lt: any) => lt.name.toLowerCase() === formData.loanType);
    if (!loanType) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid loan type selected.',
      });
      return;
    }

    const amount = formData.loanAmount;
    if (amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a valid loan amount.',
      });
      return;
    }

    const durationDays = parseInt(formData.duration);
    if (isNaN(durationDays) || durationDays <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a valid duration.',
      });
      return;
    }

    const startDate = new Date().toISOString().split('T')[0];
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    applyLoanMutation.mutate({
      customer_id: user.customer_id,
      room_type_id: loanType.id,
      start_date: startDate,
      end_date: endDate.toISOString().split('T')[0],
      purpose: formData.purpose,
      amount,
      employment_status: formData.employmentStatus,
      housing_status: formData.housingStatus,
      terms_agreed: formData.termsAgreed ? 1 : 0,
      other_loans: formData.otherLoans,
      educational_purpose: formData.willUseForEducation ? 1 : 0,
    });
  };

  // FIX: Use .name instead of .type
  const getLoanTypeLabel = () => {
    if (loanTypesLoading) return 'Loading...';
    if (loanTypesError) return 'Error';
    const loanType = loanTypes?.find((lt: any) => lt.name.toLowerCase() === formData.loanType);
    return loanType ? loanType.name : '';
  };

  const getMaxLoanAmount = () => {
    switch (formData.loanType) {
      case 'quick':
        return 500;
      case 'term':
        return 2000;
      case 'academic':
        return 5000;
      default:
        return 500;
    }
  };
  const getDurationOptions = () => {
    switch (formData.loanType) {
      case 'quick':
        return [
          { value: '30', label: '30 days' },
          { value: '60', label: '60 days' },
        ];
      case 'term':
        return [
          { value: '90', label: '3 months' },
          { value: '120', label: '4 months' },
          { value: '180', label: '6 months' },
        ];
      case 'academic':
        return [
          { value: '270', label: '9 months' },
          { value: '365', label: '12 months' },
        ];
      default:
        return [{ value: '30', label: '30 days' }];
    }
  };

  if (loanTypesError) {
    return (
      <>
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center text-sm text-primary dark:text-primary-400 hover:text-primary/80 dark:hover:text-primary-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>
            <p className="text-red-600 dark:text-red-400">Failed to load loan types. Please try again later.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm text-primary dark:text-primary-400 hover:text-primary/80 dark:hover:text-primary-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Loan Application</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Complete the form below to apply for a student micro-loan.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1 ? 'bg-primary dark:bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                1
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary dark:bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2 ? 'bg-primary dark:bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                2
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary dark:bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 3 ? 'bg-primary dark:bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className={step >= 1 ? 'text-primary dark:text-primary-400 font-medium' : ''}>Loan Details</div>
              <div className={step >= 2 ? 'text-primary dark:text-primary-400 font-medium' : ''}>Financial Information</div>
              <div className={step >= 3 ? 'text-primary dark:text-primary-400 font-medium' : ''}>Review & Submit</div>
            </div>
          </div>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">
                {step === 1 && 'Loan Details'}
                {step === 2 && 'Financial Information'}
                {step === 3 && 'Review & Submit'}
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                {step === 1 && 'Tell us about the loan you’re applying for'}
                {step === 2 && 'Tell us about your financial situation'}
                {step === 3 && 'Review your application before submitting'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="loanType" className="dark:text-gray-200">Loan Type</Label>
                    <Select
                      value={formData.loanType}
                      onValueChange={(value) => handleSelectChange(value, 'loanType')}
                      disabled={loanTypesLoading}
                    >
                      <SelectTrigger id="loanType" className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 dark:border-gray-600">
                        {/* FIX: Use .name instead of .type */}
                        {loanTypes?.map((type: any) => (
                          <SelectItem key={type.id} value={type.name.toLowerCase()} className="dark:text-gray-100">
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.loanType && (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="loanAmount" className="dark:text-gray-200">
                            Loan Amount (${formData.loanAmount})
                          </Label>
                          <span className="text-xs text-muted-foreground dark:text-gray-400">
                            Max: ${getMaxLoanAmount().toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          id="loanAmount"
                          defaultValue={[formData.loanAmount]}
                          max={getMaxLoanAmount()}
                          min={100}
                          step={50}
                          onValueChange={handleSliderChange}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-400">
                          <span>$100</span>
                          <span>${getMaxLoanAmount()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="purpose" className="dark:text-gray-200">Purpose of Loan</Label>
                        <Textarea
                          id="purpose"
                          name="purpose"
                          placeholder="Briefly describe what you will use the loan for..."
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="min-h-[100px] bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="duration" className="dark:text-gray-200">Loan Duration</Label>
                        <Select
                          value={formData.duration}
                          onValueChange={(value) => handleSelectChange(value, 'duration')}
                        >
                          <SelectTrigger id="duration" className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-gray-700 dark:border-gray-600">
                            {getDurationOptions().map((option) => (
                              <SelectItem key={option.value} value={option.value} className="dark:text-gray-100">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="willUseForEducation" className="flex items-center gap-2 dark:text-gray-200">
                          Will this loan be used for educational purposes?
                          <HelpCircle className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="willUseForEducation"
                            checked={formData.willUseForEducation}
                            onCheckedChange={(checked) => handleCheckboxChange(!!checked, 'willUseForEducation')}
                          />
                          <label
                            htmlFor="willUseForEducation"
                            className="text-sm font-medium leading-none dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Yes, this loan will be used for educational purposes
                          </label>
                        </div>
                        {formData.willUseForEducation && (
                          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1">
                            Educational loans may qualify for certain benefits and protections.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus" className="dark:text-gray-200">Employment Status</Label>
                    <Select
                      value={formData.employmentStatus}
                      onValueChange={(value) => handleSelectChange(value, 'employmentStatus')}
                    >
                      <SelectTrigger id="employmentStatus" className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="part-time" className="dark:text-gray-100">Part-time</SelectItem>
                        <SelectItem value="full-time" className="dark:text-gray-100">Full-time</SelectItem>
                        <SelectItem value="unemployed" className="dark:text-gray-100">Not currently employed</SelectItem>
                        <SelectItem value="internship" className="dark:text-gray-100">Internship/Work-study</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncome" className="dark:text-gray-200">Monthly Income</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground dark:text-gray-400">
                        $
                      </span>
                      <Input
                        id="monthlyIncome"
                        name="monthlyIncome"
                        type="number"
                        placeholder="0.00"
                        value={formData.monthlyIncome}
                        onChange={handleInputChange}
                        className="pl-8 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Include all sources of income (job, scholarships, family support, etc.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="housingStatus" className="dark:text-gray-200">Housing Status</Label>
                    <Select
                      value={formData.housingStatus}
                      onValueChange={(value) => handleSelectChange(value, 'housingStatus')}
                    >
                      <SelectTrigger id="housingStatus" className="bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                        <SelectValue placeholder="Select housing status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-700 dark:border-gray-600">
                        <SelectItem value="dorm" className="dark:text-gray-100">University Dorm</SelectItem>
                        <SelectItem value="apartment" className="dark:text-gray-100">Apartment/House (renting)</SelectItem>
                        <SelectItem value="family" className="dark:text-gray-100">Living with Family</SelectItem>
                        <SelectItem value="own" className="dark:text-gray-100">Own Home</SelectItem>
                        <SelectItem value="other" className="dark:text-gray-100">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="otherLoans" className="dark:text-gray-200">Do you have any other outstanding loans?</Label>
                    <RadioGroup
                      value={formData.otherLoans}
                      onValueChange={(value) => handleRadioChange(value, 'otherLoans')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="otherLoans-yes" />
                        <Label htmlFor="otherLoans-yes" className="dark:text-gray-200">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="otherLoans-no" />
                        <Label htmlFor="otherLoans-no" className="dark:text-gray-200">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="border rounded-lg p-4 bg-muted/30 dark:bg-gray-700">
                    <h3 className="font-medium mb-4 dark:text-gray-200">Loan Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Loan Type:</span>
                        <span className="font-medium dark:text-gray-200">{getLoanTypeLabel()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Amount:</span>
                        <span className="font-medium dark:text-gray-200">${formData.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Duration:</span>
                        <span className="font-medium dark:text-gray-200">
                          {getDurationOptions().find((option) => option.value === formData.duration)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Purpose:</span>
                        <span className="font-medium dark:text-gray-200">{formData.purpose}</span>
                      </div>

                      <div className="border-t my-2 dark:border-gray-600"></div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Employment Status:</span>
                        <span className="font-medium dark:text-gray-200 capitalize">
                          {formData.employmentStatus.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Monthly Income:</span>
                        <span className="font-medium dark:text-gray-200">
                          ${parseFloat(formData.monthlyIncome || '0').toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Housing Status:</span>
                        <span className="font-medium dark:text-gray-200 capitalize">{formData.housingStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-gray-400">Other Loans:</span>
                        <span className="font-medium dark:text-gray-200 capitalize">{formData.otherLoans}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="termsAgreed"
                        checked={formData.termsAgreed}
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked, 'termsAgreed')}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="termsAgreed"
                          className="text-sm font-medium leading-none dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                        <p className="text-xs text-muted-foreground dark:text-gray-400">
                          By submitting this application, you agree to our{' '}
                          <Link to="/terms" className="text-primary dark:text-primary-400 hover:underline">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-primary dark:text-primary-400 hover:underline">
                            Privacy Policy
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                      <div className="flex items-start">
                        <InfoIcon className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          By submitting this application, you authorize ScholarLoanHub to check your credit information
                          and verify the information provided. This will not affect your credit score.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={prevStep} className="dark:border-gray-600 dark:text-gray-200">
                  Previous
                </Button>
              ) : (
                <div></div>
              )}

              {step < 3 ? (
                <Button
                  onClick={() => {
                    if (step === 1 && validateStep1()) nextStep();
                    else if (step === 2 && validateStep2()) nextStep();
                  }}
                  className="bg-primary dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={applyLoanMutation.isPending || loanTypesLoading}
                  className="bg-primary dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                  {applyLoanMutation.isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Questions or concerns? Contact our support team at{' '}
              <a
                href="mailto:support@scholarloan.com"
                className="text-primary dark:text-primary-400 hover:underline"
              >
                support@scholarloan.com
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoanApplication;