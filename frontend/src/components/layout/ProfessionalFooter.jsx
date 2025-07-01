import React from "react";
import { Heart } from "lucide-react";

const ProfessionalFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      {/* Bottom Copyright Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-300">
                © {currentYear} Enegix Global Attendance Management System. All
                rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by Enegix Web Solutions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ProfessionalFooter;
