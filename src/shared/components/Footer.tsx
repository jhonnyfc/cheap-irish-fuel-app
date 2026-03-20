import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-100 border-t border-gray-300 py-4 mt-auto">
      <div className="text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} CheapIrishFuel by{" "}
        <a className="text-blue-600" href="https://aidora.info/jhonnyfc">
          jhonnyfc
        </a>
      </div>
      <div className="text-center text-xs text-gray-500 mt-1">
        Developed with ❤️ to help you save on fuel costs across Ireland.
      </div>
    </footer>
  );
};

export default Footer;
