
import { Pill } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Pill className="h-6 w-6 text-white mr-2" />
            <span className="text-lg font-semibold">PilulePal</span>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PilulePal. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
