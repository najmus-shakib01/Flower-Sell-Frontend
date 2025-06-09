import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { baseUrl, emailValidation } from "../../../constants/env.constants";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = async (email) => {
    try {
      const response = await fetch(
        `https://apilayer.net/api/check?access_key=${emailValidation}&email=${email}`
      );

      if (!response.ok) {
        throw new Error("Email validation service failed");
      }

      const data = await response.json();
      console.log("Email Validation Data:", data);

      if (!data.format_valid || !data.smtp_check || data.disposable) {
        throw new Error("দয়া করে একটি সঠিক ও সক্রিয় ইমেইল ঠিকানা প্রদান করুন");
      }

      return true;
    } catch (error) {
      console.error("Email validation error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await validateEmail(formData.email);

      const response = await fetch(`${baseUrl}/flower/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "বার্তা পাঠাতে ব্যর্থ হয়েছে!");
      }

      toast.success("✅ আপনার বার্তা সফলভাবে পাঠানো হয়েছে! ইমেইল চেক করুন", {
        duration: 5000,
        position: "top-right",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`❌ ${error.message}`, {
        duration: 4000,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container max-w-screen-xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between pt-28 gap-10">
      <Helmet>
        <title>Contact</title>
      </Helmet>
      <div className="w-full md:w-1/2">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <img className="w-full" src="/contact.png" alt="Contact" />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-center text-2xl font-bold mb-4">যোগাযোগ করুন</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold">আপনার নাম</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              placeholder="আপনার নাম লিখুন"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">ইমেইল</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              placeholder="আপনার ইমেইল লিখুন"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">বার্তা</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              rows="4"
              placeholder="আপনার বার্তা লিখুন"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "পাঠানো হচ্ছে..." : "পাঠান"}
            </button>
            <button
              type="reset"
              onClick={() => setFormData({ name: "", email: "", message: "" })}
              className="w-1/2 bg-gray-300 text-black py-2 rounded-lg font-bold hover:bg-gray-400 transition"
            >
              রিসেট
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
