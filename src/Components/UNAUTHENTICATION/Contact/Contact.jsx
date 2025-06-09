import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { FiMail, FiMessageSquare, FiUser } from "react-icons/fi";

const ContactForm = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const accessKey = import.meta.env.VITE_EMAIL_VALIDATION;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = async (email) => {
    try {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) return false;

      const response = await axios.get(
        `https://apilayer.net/api/check?access_key=${accessKey}&email=${email}`
      );
      return response.data.format_valid && response.data.smtp_check;
    } catch (error) {
      console.error("Email validation failed:", error);
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  };

  const submitContactForm = async (formData) => {
    const response = await axios.post(`${baseUrl}/flower/contact/`, formData);
    return response.data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Fill in all fields.");
      }

      const isEmailValid = await validateEmail(formData.email);
      if (!isEmailValid) {
        throw new Error("Please provide a valid email address.");
      }

      return await submitContactForm(formData);
    },
    onSuccess: () => {
      toast.success("Your message has been successfully sent!");
      setFormData({ name: "", email: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message || "There has been trouble sending messages. Please try again later.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
    <div>
      <Helmet>
        <title>যোগাযোগ করুন</title>
      </Helmet>
      
        <section className="container max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between pt-28 gap-10">
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <div className="w-full md:w-1/2">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <img className="w-full" src="/contact.png" alt="Contact Image" />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-center text-2xl font-bold mb-4">Contact Me</h3>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiUser className="text-gray-500 transition-colors" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 focus:outline-none text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiMail className="text-gray-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 focus:outline-none text-gray-800 placeholder-gray-400"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute top-4 left-4">
                <FiMessageSquare className="text-gray-500 transition-colors" />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Your Message..."
                className="w-full pl-12 pr-4 py-3 bg-transparent border-b-2 focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition ${
                isPending ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isPending ? "পাঠানো হচ্ছে..." : "বার্তা পাঠান"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default ContactForm;