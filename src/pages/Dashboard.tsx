import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard, IndianRupee, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { loanService } from '@/services/loan-service';
import Navbar from '@/components/Navbar_d';
import Footer from '@/components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { isLoading, error, data } = useQuery({
    queryKey: ['userDashboardData'],
    queryFn: async () => {
      const response = await loanService.getUserDashboardData();
      return response;
    },
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast({
        variant: 'destructive',
        title: 'Session Expired',
        description: 'Please log in again.',
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

  const handleApplyLoanClick = () => {
    navigate('/apply');
  };

  const handlePayLoanClick = (reservationId: number) => {
    navigate(`/pay-loan/${reservationId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-6 px-4 flex-grow">
          <h1 className="text-2xl font-semibold mb-4">My Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="bg-white shadow-md">
                <CardHeader>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-white">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {Array.from({ length: 9 }).map((_, index) => (
                      <TableHead key={index}>
                        <Skeleton className="h-4 w-24" />
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {Array.from({ length: 9 }).map((_, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto py-6 px-4 flex-grow">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard data. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  const userLoans = data?.dashboardTable || [];
  const totalLoans = userLoans.length;
  const approvedLoans = userLoans.filter((loan: any) => loan.status === 'approved').length;
  const pendingLoans = userLoans.filter((loan: any) => loan.status === 'pending').length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-grow">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-semibold mb-4">My Dashboard</h1>
          <div className="space-x-2 flex items-center">
            <Button onClick={handleApplyLoanClick} className="bg-primary">
              Apply for Loan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
              <IndianRupee className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLoans}</div>
              <div className="text-sm text-gray-500">Loans applied</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedLoans}</div>
              <div className="text-sm text-gray-500">Loans approved</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
              <Calendar className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingLoans}</div>
              <div className="text-sm text-gray-500">Loans pending</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white">
          <CardHeader>
            <h2 className="text-2xl font-semibold">My Loans</h2>
          </CardHeader>
          <CardContent>
            {userLoans.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Loan ID</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Complaint</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userLoans.map((row: any) => (
                      <TableRow key={row.reservation_id || row.id}>
                        <TableCell className="font-medium">{row.id}</TableCell>
                        <TableCell>{row.purpose || row.room_type || '-'}</TableCell>
                        <TableCell>
                          {row.date || row.start_date ? new Date(row.date || row.start_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {row.dueDate || row.end_date ? new Date(row.dueDate || row.end_date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          {row.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                          {row.status === 'approved' && (
                            <Badge className="bg-green-500 text-white">Approved</Badge>
                          )}
                          {row.status === 'declined' && <Badge variant="destructive">Declined</Badge>}
                        </TableCell>
                        <TableCell>
                          ${Number(row.amount || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>{row.purpose || '-'}</TableCell>
                        <TableCell>{row.complaint || '-'}</TableCell>
                        <TableCell>
                          {row.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePayLoanClick(row.reservation_id || row.id)}
                            >
                              Pay Loan
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-gray-500">No loans found.</div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;