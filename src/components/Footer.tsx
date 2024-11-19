// Footer.tsx
const Footer = () => {
    return (
      <footer className="fixed bottom-0 w-full py-6 mt-auto text-xs">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-400">
              © {new Date().getFullYear()} <span className="hover:text-purple-600 transition-colors">Aldonime</span>. All rights reserved.
            </p>
            <div className="flex space-x-2">
              <a
                href="https://github.com/ifalfahri/aldonime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                GitHub
              </a>
              <a
                href="/about"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;