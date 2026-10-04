// components/Footer.jsx
import Link from "next/link";
import { FaInstagram } from "react-icons/fa"; // pastikan install react-icons: npm i react-icons

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-400">
        <span>© 2025 Lucratus Agency, All rights reserved.</span>
        <Link
          href="https://www.instagram.com/lucratusagency"
          target="_blank"
          className="hover:text-white mt-2 md:mt-0"
        >
          <FaInstagram />
        </Link>
      </div>
    </footer>
  );
}
