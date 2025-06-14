
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Pill, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { NavLinks } from "./navbar/NavLinks";
import { MobileMenu } from "./navbar/MobileMenu";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, isLoading, handleLogout, getInitials } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Afficher un état de chargement minimal pendant l'initialisation
  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <Pill className="h-8 w-auto text-medBlue" />
                <span className="ml-2 text-xl font-semibold text-medBlue">
                  PilulePal
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Pill className="h-8 w-auto text-medBlue" />
              <span className="ml-2 text-xl font-semibold text-medBlue">
                PilulePal
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <NavLinks user={user} profile={profile} getInitials={getInitials} />
            
            {user ? (
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-medBlue"
              >
                Déconnexion
              </Button>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                className="flex items-center bg-medBlue hover:bg-blue-600"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Connexion
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-medBlue"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <MobileMenu 
          user={user} 
          profile={profile} 
          getInitials={getInitials}
          onLogout={handleLogout}
          onToggleMenu={toggleMenu}
        />
      )}
    </nav>
  );
}

export default Navbar;
