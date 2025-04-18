import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Send, Info, X, Smile, BookOpen, Zap, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils"; // Corrected import path

interface FinanceData {
  questions: Record<string, string>;
  intents: Record<string, string[]>;
}

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sample suggested questions
 // Sample suggested questions tailored for Indian students
const suggestedQuestions = [
  "What are the current interest rates for education loans in India?",
  "Do I need collateral for an education loan in India?",
  "What documents do I need for an education loan application?",
  "Are there tax benefits for education loans under Section 80E?",
  "How does the loan disbursement process work for Indian students?"
];


  useEffect(() => {
    fetch('/finance_data.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch finance data');
        return response.json();
      })
      .then((data) => {
        console.log('Finance data loaded:', data);
        setFinanceData(data);
        // Add initial welcome message when data is loaded
        setMessages([{
          text: "Hey there! 👋 I'm your friendly ScholarLoanHub assistant, here to help you navigate the world of student loans. How can I brighten your day with some knowledge?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      })
      .catch((error) => {
        console.error('Error loading finance data:', error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const findBestMatch = (userInput: string): string => {
      if (!financeData) return "I'm sorry, I don't have information on that right now. 😔";

      // Check for greetings and farewells first
      if (financeData.intents.greet.some(greet => userInput.includes(greet))) {
          return "Hello! 😊 How can I assist you with your financial queries at ScholarLoanHub today?";
      }

      if (financeData.intents.farewell.some(farewell => userInput.includes(farewell))) {
          return "Goodbye! 👋 Feel free to return for more financial assistance anytime!";
      }

      // Check for direct question matches
      for (const question in financeData.questions) {
          if (userInput.includes(question.toLowerCase())) {
              return financeData.questions[question];
          }
      }

      // Check for intent matches with partial question matches
      for (const intent in financeData.intents) {
          if (financeData.intents[intent].some(keyword => userInput.includes(keyword))) {
              // Find questions that might be related to this intent
              for (const question in financeData.questions) {
                  // Check if any keywords from the question appear in the user input
                  const questionWords = question.toLowerCase().split(' ');
                  for (const word of questionWords) {
                      if (word.length > 3 && userInput.includes(word)) { // Only match significant words
                          return financeData.questions[question];
                      }
                  }
              }
          }
      }
      return "I'm sorry, I don't have specific information on that. Could you rephrase your question about student loans? 🤔";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !financeData) return;

    const userMessage = {
      text: input,
      sender: 'user' as const,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    const userInput = input.toLowerCase();
    setInput('');
    setShowSuggestions(false);

    // Add typing indicator
    setMessages(prev => [...prev, { text: '...', sender: 'bot' }]);

    // Simulate processing time
    setTimeout(() => {
      const response = findBestMatch(userInput);

      // Remove typing indicator and add response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages.pop(); // Remove typing indicator
        return [...newMessages, {
          text: response,
          sender: 'bot',
          timestamp: new Date()
        }];
      });
    }, 800);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    setShowSuggestions(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                Your Friendly Student Loan Assistant
              </h1>
              <p className="text-xl text-gray-600 mb-10">
                Got questions about student loans? I've got answers! Let's make this less stressful, together.
              </p>
            </div>
          </div>
        </section>

        {/* Chatbot Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-t-lg">
                <CardTitle className="flex items-center text-indigo-700 font-semibold">
                  <MessageCircle className="mr-2 h-6 w-6" />
                  ScholarLoanHub Chat
                </CardTitle>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()} | Your Financial Friend
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div
                    ref={chatContainerRef}
                    className="h-[400px] overflow-y-auto mb-2 border rounded p-4 bg-gray-50 flex flex-col"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 text-indigo-600"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`mb-4 ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
                          >
                            <div className="flex items-end">
                              {msg.sender === 'bot' && (
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                                  <Smile size={20} />
                                </div>
                              )}
                              <span
                                className={cn(
                                  "inline-block p-3 rounded-lg max-w-[80%] shadow-md",
                                  msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                    : msg.text === '...'
                                      ? 'bg-gray-200 animate-pulse text-gray-700'
                                      : 'bg-indigo-100 text-gray-800 rounded-tl-none'
                                )}
                              >
                                {msg.text}
                              </span>
                              {msg.sender === 'user' && (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 ml-2">
                                  <span className="text-xs font-semibold">You</span>
                                </div>
                              )}
                            </div>
                            {msg.timestamp && msg.text !== '...' && (
                              <span className="text-xs text-gray-500 mt-1 ml-12">
                                {formatTime(msg.timestamp)}
                              </span>
                            )}
                          </div>
                        ))}

                        {showSuggestions && messages.length === 1 && (
                          <div className="mt-6">
                            <p className="text-sm text-gray-500 mb-2">Here are some questions I can help with:</p>
                            <div className="flex flex-wrap gap-2">
                              {suggestedQuestions.map((question, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleSuggestedQuestion(question)}
                                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm py-2 px-4 rounded-full transition-colors shadow-sm"
                                >
                                  {question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <form onSubmit={handleSend} className="flex space-x-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm"
                      placeholder="Ask me anything about student loans..."
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-md"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-indigo-700">What I Can Do For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Instant Answers</h3>
                <p className="text-gray-600">Get quick, reliable answers to your student loan questions. No more waiting!</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Comprehensive Info</h3>
                <p className="text-gray-600">I'm trained on a ton of student loan details, from federal to private, and everything in between.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Always Available</h3>
                <p className="text-gray-600">I'm here for you 24/7.  Ask questions any time, day or night.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-16 bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-start border border-amber-100 bg-amber-50">
              <Info className="h-6 w-6 text-amber-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Important Note:</h2>
                <p className="mt-2 text-gray-600">
                  I provide general info about student loans. While I aim for accuracy, this isn't financial advice. For personalized help, please chat with a financial advisor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              I've helped you get informed.  Now, let's get you closer to your goals!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700">
                  Apply for a Loan Now
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-indigo-600 w-full sm:w-auto">
                  How It Works
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

export default ChatbotPage;
