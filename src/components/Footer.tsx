
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img 
              src="/lovable-uploads/fe2341f8-92af-4f6f-8d00-0dea0a89b65f.png" 
              alt="HealthCentral Logo" 
              className="h-6 w-auto mr-2"
            />
            <span className="text-lg font-semibold">HealthCentral</span>
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} HealthCentral. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
