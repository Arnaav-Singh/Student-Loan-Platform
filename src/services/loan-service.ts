import { toast } from 'sonner';
import { apiService } from '@/lib/api-client';

interface ApiLoan {
  reservation_id: number;
  customer_id: number;
  room_type_id: number;
  room_type: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'approved' | 'declined';
  amount: number | null | undefined | string;
  purpose: string;
  complaint: string | null;
  created_at: string;
  employment_status: string | null;
  housing_status: string | null;
  terms_agreed: number;
  other_loans: string | null;
  educational_purpose: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
}

interface AppLoan {
  id: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'declined';
  date?: string;
  dueDate?: string;
  applicant?: {
    name: string;
    email: string;
    university: string;
  };
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

const convertApiLoanToAppLoan = (apiLoan: ApiLoan): AppLoan => {
  const parsedAmount = Number(apiLoan.amount);
  return {
    id: apiLoan.reservation_id.toString(),
    amount: isNaN(parsedAmount) ? 0 : parsedAmount,
    purpose: apiLoan.purpose || apiLoan.room_type || 'Loan',
    status: apiLoan.status || 'pending',
    date: apiLoan.start_date || '',
    dueDate: apiLoan.end_date || '',
    applicant: {
      name: apiLoan.customer_name || '',
      email: apiLoan.customer_email || '',
      university: apiLoan.customer_phone || '',
    },
    complaint: apiLoan.complaint || null,
    employment_status: apiLoan.employment_status || null,
    housing_status: apiLoan.housing_status || null,
    terms_agreed: !!apiLoan.terms_agreed,
    other_loans: apiLoan.other_loans || null,
    educational_purpose: !!apiLoan.educational_purpose,
  };
};

export const loanService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiService.login({ email, password });
      const data = response.data;
      if (!data.user || !data.user.customer_id) {
        throw new Error('Invalid login response: customer_id missing');
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Login successful');
      return { user: data.user, token: data.token };
    } catch (error: any) {
      throw new Error(
        error.response?.status === 401
          ? 'Invalid email or password.'
          : error.response?.data?.error || error.message || 'Login failed.'
      );
    }
  },

  register: async (userData: { name: string; email: string; phone: string; password: string; university?: string }) => {
    try {
      const response = await apiService.register(userData);
      const data = response.data;
      if (!data.user || !data.user.customer_id) {
        throw new Error('Invalid registration response: customer_id missing');
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Registration successful');
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.status === 400
          ? error.response.data.error
          : error.response?.data?.error || error.message || 'Registration failed.'
      );
    }
  },

  getCustomers: async () => {
    try {
      const response = await apiService.getCustomers();
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch customers');
    }
  },

  getAdminDashboardData: async () => {
    try {
      const response = await apiService.getAdminDashboardData();
      return {
        dashboardTable: response.data.dashboardTable.map(convertApiLoanToAppLoan),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch admin dashboard data');
    }
  },

  getUserDashboardData: async () => {
    try {
      const response = await apiService.getUserDashboardData();
      return {
        dashboardTable: response.data.dashboardTable.map(convertApiLoanToAppLoan),
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user dashboard data');
    }
  },

  getLoans: async () => {
    try {
      const response = await apiService.getLoans();
      return response.data.map(convertApiLoanToAppLoan);
    } catch (error: any) {
      return [];
    }
  },

  getAllLoans: async () => {
    try {
      const response = await apiService.getLoans();
      return response.data.map(convertApiLoanToAppLoan);
    } catch (error: any) {
      return [];
    }
  },

  applyForLoan: async (loanData: { loan_type: string; amount: string; purpose: string; duration: string }) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found. Please log in.');

      const user = JSON.parse(userStr);
      const customerId = user.customer_id;
      if (!customerId) throw new Error('Customer ID not found.');

      const loanTypesResponse = await apiService.getLoanTypes();
      const loanTypes = loanTypesResponse.data;
      const loanType = loanTypes.find((lt: any) => lt.name === loanData.loan_type);
      if (!loanType) throw new Error('Selected loan type not found.');

      const amount = parseFloat(loanData.amount);
      if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount.');

      const durationMonths = parseInt(loanData.duration);
      if (isNaN(durationMonths) || durationMonths <= 0) throw new Error('Invalid duration.');

      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + durationMonths);

      const loanResponse = await apiService.createLoan({
        customer_id: customerId,
        room_type_id: loanType.id,
        start_date: startDate,
        end_date: endDate.toISOString().split('T')[0],
        purpose: loanData.purpose,
        amount,
        terms_agreed: 1,
      });

      toast.success('Loan application submitted');
      return convertApiLoanToAppLoan(loanResponse.data);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to apply for loan');
    }
  },

  makeRepayment: async (loanId: string, amount: number, complaint?: string) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) throw new Error('User not found. Please log in.');

      const user = JSON.parse(userStr);
      const customerId = user.customer_id;
      if (!customerId) throw new Error('Customer ID not found.');

      const response = await apiService.createRepayment({
        customer_id: customerId,
        reservation_id: parseInt(loanId),
        amount,
        complaint: complaint || null,
      });

      toast.success(`Repayment of $${amount} recorded for loan #${loanId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to make repayment');
    }
  },

  updateLoanStatus: async (loanId: string, status: 'approved' | 'declined' | 'pending') => {
    try {
      const response = await apiService.updateLoan(parseInt(loanId), { status });
      toast.success(`Loan #${loanId} status updated to ${status}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to update loan status');
    }
  },
};

export default loanService;