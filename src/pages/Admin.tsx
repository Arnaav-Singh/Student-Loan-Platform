import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart3, IndianRupee, Users, Search, LayoutDashboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { loanService } from '@/services/loan-service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

// Define types
interface Applicant {
  name: string;
  email: string;
  university: string;
}

interface Loan {
  id: string;
  amount: number | string;
  purpose: string;
  status: 'pending' | 'approved' | 'declined';
  date?: string;
  dueDate?: string;
  applicant?: Applicant;
  complaint?: string | null;
  employment_status?: string | null;
  housing_status?: string | null;
  terms_agreed?: boolean;
  other_loans?: string | null;
  educational_purpose?: boolean;
}

interface Customer {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  university?: string;
  role: 'admin' | 'user';
  customer_id: number;
}

type LoanStatus = 'pending' | 'approved' | 'declined';

interface DashboardData {
  dashboardTable: Loan[];
}

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
    <p className="text-red-800 dark:text-red-300">Error: {error.message}</p>
    <Button onClick={resetErrorBoundary} className="mt-2">
      Retry
    </Button>
  </div>
);

const Admin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check user role
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-red-600 dark:text-red-400">Access denied: Admin privileges required.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Fetch loans
  const { data: loanData, isLoading: isLoadingLoans, error: loanError } = useQuery({
    queryKey: ['adminDashboardData'],
    queryFn: loanService.getAdminDashboardData,
    select: (response) => ({
      dashboardTable: response.dashboardTable.map((loan: Loan) => ({
        ...loan,
        amount: Number(loan.amount),
      })),
    }),
  });

  // Fetch users
  const { data: users, isLoading: isLoadingUsers, error: userError } = useQuery({
    queryKey: ['customers'],
    queryFn: loanService.getCustomers,
  });

  const updateLoanMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LoanStatus }) =>
      loanService.updateLoanStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
      toast({
        title: `Loan #${variables.id} Updated`,
        description: `Status changed to ${variables.status}.`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update loan status.',
      });
    },
  });

  const handleUpdateLoanStatus = (id: string, status: LoanStatus) => {
    updateLoanMutation.mutate({ id, status });
  };

  const handleSearch = (searchTerm: string) => {
    if (!loanData?.dashboardTable) return;
    if (!searchTerm.trim()) {
      queryClient.setQueryData(['adminDashboardData'], loanData);
      return;
    }
    const filtered = loanData.dashboardTable.filter((loan: Loan) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        loan.id.toLowerCase().includes(lowerSearchTerm) ||
        (loan.applicant?.name?.toLowerCase().includes(lowerSearchTerm) || false) ||
        loan.purpose.toLowerCase().includes(lowerSearchTerm) ||
        loan.status.toLowerCase().includes(lowerSearchTerm)
      );
    });
    queryClient.setQueryData(['adminDashboardData'], { dashboardTable: filtered });
  };

  if (isLoadingLoans || isLoadingUsers) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (loanError || userError) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-red-600 dark:text-red-400">
            Error loading data: {loanError?.message || userError?.message}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const loans = loanData?.dashboardTable || [];
  const customerList = users || [];

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Admin Dashboard</CardTitle>
                    <CardDescription>Manage loan applications and user data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="dashboard" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </TabsTrigger>
                        <TabsTrigger value="loans">
                          <IndianRupee className="mr-2 h-4 w-4" />
                          Loans
                        </TabsTrigger>
                        <TabsTrigger value="users">
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </TabsTrigger>
                        <TabsTrigger value="reports">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Reports
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="dashboard" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card className="card-hover">
                            <CardHeader>
                              <CardTitle>Total Loans</CardTitle>
                              <CardDescription>Total number of loan applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">{loans.length}</div>
                            </CardContent>
                          </Card>
                          <Card className="card-hover">
                            <CardHeader>
                              <CardTitle>Approved Loans</CardTitle>
                              <CardDescription>Number of approved loan applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">
                                {loans.filter((loan) => loan.status === 'approved').length}
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="card-hover">
                            <CardHeader>
                              <CardTitle>Pending Loans</CardTitle>
                              <CardDescription>Number of pending loan applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="text-3xl font-bold">
                                {loans.filter((loan) => loan.status === 'pending').length}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="loans" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Loan Management</CardTitle>
                            <CardDescription>View, search, and manage loan applications.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-4 flex items-center space-x-2">
                              <Search className="h-4 w-4 text-gray-500" />
                              <Input
                                type="text"
                                placeholder="Search loans..."
                                onChange={(e) => handleSearch(e.target.value)}
                              />
                            </div>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Applicant</TableHead>
                                  <TableHead>Purpose</TableHead>
                                  <TableHead>Amount</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {loans.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                      No loans found.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  loans.map((loan) => {
                                    const amount = Number(loan.amount);
                                    return (
                                      <TableRow key={loan.id}>
                                        <TableCell>{loan.id}</TableCell>
                                        <TableCell>{loan.applicant?.name || 'N/A'}</TableCell>
                                        <TableCell>{loan.purpose}</TableCell>
                                        <TableCell>
                                          {isNaN(amount) ? 'N/A' : `$${amount.toFixed(2)}`}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              loan.status === 'approved'
                                                ? 'default'
                                                : loan.status === 'pending'
                                                ? 'secondary'
                                                : 'destructive'
                                            }
                                          >
                                            {loan.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          <Select
                                            defaultValue={loan.status}
                                            onValueChange={(value) =>
                                              handleUpdateLoanStatus(loan.id, value as LoanStatus)
                                            }
                                          >
                                            <SelectTrigger className="w-[180px]">
                                              <SelectValue placeholder={loan.status} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="approved">Approve</SelectItem>
                                              <SelectItem value="pending">Set to Pending</SelectItem>
                                              <SelectItem value="declined">Decline</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="users" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View and manage user accounts.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>ID</TableHead>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>University</TableHead>
                                  <TableHead>Role</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {customerList.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center">
                                      No users found.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  customerList.map((user: Customer) => (
                                    <TableRow key={user.user_id}>
                                      <TableCell>{user.user_id}</TableCell>
                                      <TableCell>{user.name || 'N/A'}</TableCell>
                                      <TableCell>{user.email || 'N/A'}</TableCell>
                                      <TableCell>{user.phone || 'N/A'}</TableCell>
                                      <TableCell>{user.university || 'N/A'}</TableCell>
                                      <TableCell>
                                        <Badge
                                          variant={user.role === 'admin' ? 'default' : 'secondary'}
                                        >
                                          {user.role}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="reports">
                        <Card>
                          <CardHeader>
                            <CardTitle>Reports and Analytics</CardTitle>
                            <CardDescription>Coming Soon: Generate reports on loan data and user activity.</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-center">
                              <BarChart3 className="inline-block h-6 w-6 mb-2 text-gray-500" />
                              <p className="text-lg text-gray-600">This feature is under development.</p>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default Admin;