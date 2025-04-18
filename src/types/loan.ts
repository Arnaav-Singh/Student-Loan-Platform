
export type LoanStatus = "approved" | "pending" | "declined";

export interface Loan {
  id: string;
  amount: number;
  purpose: string;
  status: LoanStatus;
  date: string;
  dueDate: string;
  applicant?: {
    name: string;
    email: string;
    university: string;
  };
  loanType?: string;
  duration?: string;
  employmentStatus?: string;
  monthlyIncome?: string;
}
