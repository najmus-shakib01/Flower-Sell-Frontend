import {
  FaTwitter,
  FaYoutube,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white shadow-md rounded p-6 md:p-10 mt-6 text-center">
      {/* Contact Section */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 md:gap-8 items-center justify-center text-base md:text-lg">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-blue-500" size={20} />
          <span className="text-sm md:text-base">
            syednazmusshakib94@gmail.com
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-red-500" size={20} />
          <a
            href="https://www.google.com/maps/@24.2693741,91.4762642,51m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI1MDIyNC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm md:text-base"
          >
            Sylhet, Shaistaganj, Habiganj, Bangladesh
          </a>
        </div>
        <div className="flex items-center gap-2">
          <FaPhoneAlt className="text-green-500" size={20} />
          <span className="text-sm md:text-base">+8801401997130</span>
        </div>
        <div className="flex items-center gap-2">
          <FaWhatsapp className="text-green-600" size={20} />
          <span className="text-sm md:text-base">+8801401997130</span>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="flex justify-center items-center gap-5 mt-5">
        <a
          href="https://x.com/syed_shaki27278"
          target="_blank"
          className="text-blue-500 hover:text-blue-700 flex items-center justify-center"
        >
          <FaTwitter size={40} />
        </a>
        <a
          href="https://www.youtube.com/@syednazmusshakib1833"
          target="_blank"
          className="text-red-500 hover:text-red-700 flex items-center justify-center"
        >
          <FaYoutube size={40} />
        </a>
        <a
          href="https://www.facebook.com/syednazmusshakib.shakib"
          target="_blank"
          className="text-blue-700 hover:text-blue-900 flex items-center justify-center"
        >
          <FaFacebook size={40} />
        </a>
        <a
          href="https://github.com/najmus-shakib01"
          target="_blank"
          className="text-gray-800 hover:text-gray-600 flex items-center justify-center"
        >
          <FaGithub size={40} />
        </a>
        <a
          href="https://www.instagram.com/shakibosd/"
          target="_blank"
          className="text-pink-600 hover:text-pink-800 flex items-center justify-center"
        >
          <FaInstagram size={40} />
        </a>
        <a
          href="https://www.linkedin.com/in/syed-nazmus-shakib-686985264/"
          target="_blank"
          className="text-blue-600 hover:text-blue-800 flex items-center justify-center"
        >
          <FaLinkedin size={40} />
        </a>
      </div>

      {/* Copyright Section */}
      <aside className="mt-6 text-sm">
        <p>
          Copyright © {new Date().getFullYear()} - Develop With By{" "}
          <b>
            <a
              href="https://najmus-shakib-sand.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm md:text-base"
            >
              Najmus Shakib
            </a>
          </b>
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
