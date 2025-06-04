import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { loanService } from '@/services/loan-service';
import Navbar from '@/components/Navbar_d';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

const PayLoan = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [notes, setNotes] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid positive payment amount.',
      });
      return;
    }

    try {
      const response = await loanService.makeRepayment(reservationId || '', amount, notes);
      toast({
        title: 'Payment Successful',
        description: response.message || 'Payment has been processed successfully.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error.message || 'Unable to process payment. Please try again.',
      });
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1, ease: "easeInOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, delay: 0.2, ease: "easeInOut" } },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="container mx-auto py-10 px-6 flex-grow flex items-center justify-center">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-filter backdrop-blur-lg shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
            <CardHeader className="p-6">
              <CardTitle className="text-3xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight">
                Loan Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={inputVariants} initial="hidden" animate="visible">
                  <Label htmlFor="paymentAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Amount
                  </Label>
                  <Input
                    id="paymentAmount"
                    type="number"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    className={cn(
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
                      "dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600",
                      "transition-colors duration-300"
                    )}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} initial="hidden" animate="visible">
                  <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes (Optional)
                  </Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes or complaints"
                    className={cn(
                      "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
                      "dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 resize-none h-32",
                      "transition-colors duration-300"
                    )}
                  />
                </motion.div>
                <div className="flex justify-between">
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md px-6 py-3 transition-all duration-300"
                    >
                      Process Payment
                    </Button>
                  </motion.div>
                  <motion.div
                    variants={buttonVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                      className="text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-4 py-2 transition-colors duration-300"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default PayLoan;
