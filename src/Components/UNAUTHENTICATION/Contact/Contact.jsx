import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/env.constants";

const ContactForm = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/flower/contact/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message!");
      }

      toast.success("✅ Message Sent Successfully!", {
        duration: 3000,
        position: "top-right",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      toast.error(`❌ ${error.message}`, {
        duration: 3000,
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
          <img
            className="w-full"
            src="/contact.png"
            alt="Contact Image"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-center text-2xl font-bold mb-4">Contact Me</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              placeholder="Please Enter Your Name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              placeholder="Please Enter Your Email"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-200"
              rows="4"
              placeholder="Please Enter Message Here"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            <button
              type="reset"
              onClick={() => setFormData({ name: "", email: "", message: "" })}
              className="w-1/2 bg-gray-300 text-black py-2 rounded-lg font-bold hover:bg-gray-400 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;