import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-bold texted-primary">ScholarLoan</span>
              <span className="text-lg font-light text-muted-foreground">Hub</span>
            </Link>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Github size={18} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Mail size={18} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/about" className="text-sm text-gray-500 hover:text-gray-900">About</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy</Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">Contact</Link>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ScholarLoanHub. All rights reserved.</p>
          <p>Made by Manan Sethi & Dhruveel Sha</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;