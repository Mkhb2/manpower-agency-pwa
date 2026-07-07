"use client";

import React, { useState } from "react";
import { Camera, UploadCloud, User, MapPin, Briefcase, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const COUNTRIES = [
  "United Arab Emirates (UAE)", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Bahrain",
  "United Kingdom", "Poland", "Romania", "Croatia", "Malta", "Germany", "Portugal", 
  "Spain", "Italy", "France", "Netherlands", "Ireland", "Cyprus", "Greece",
  "Malaysia", "Singapore", "Japan", "South Korea", "Maldives", "Macau", "Hong Kong",
  "Canada", "United States", "Australia", "New Zealand"
].sort();

const JOB_CATEGORIES = [
  {
    category: "UNSKILLED CATEGORIES",
    roles: [
      "General Laborer", "Construction Worker", "Cleaner", "Housekeeping Staff", 
      "Factory Worker", "Production Helper", "Loading and Unloading Staff", 
      "Packaging Staff", "Kitchen Helper", "Dishwasher", "Office Boy / Tea Boy", 
      "Agricultural Worker / Farm Hand", "Sweeper", "Laundry Worker", "Car Washer", "Trolley Boy"
    ]
  },
  {
    category: "SEMI-SKILLED & SKILLED CATEGORIES",
    roles: [
      "Security Guard", "Driver (Light Vehicle)", "Driver (Heavy Vehicle)", "Forklift Operator", 
      "Mason", "Plumber", "Electrician", "Carpenter", "Welder", "Steel Fixer", "Painter",
      "Scaffolder", "HVAC Technician"
    ]
  },
  {
    category: "PROFESSIONAL & HEALTHCARE",
    roles: [
      "Registered Nurse", "Civil Engineer", "Mechanical Engineer", "Software Engineer", 
      "Accountant", "Sales Representative"
    ]
  }
];

export default function CandidateRegistrationForm() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });
      
      if (res.ok) {
        toast.success("Registration successful. Please log in.");
        router.push("/login");
      } else {
        const data = await res.json();
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 flex items-center justify-center font-sans">
      <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Candidate Registration
          </h1>
          <p className="text-slate-500 text-lg">
            Complete your profile to apply for top overseas opportunities.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center transition-transform group-hover:scale-105">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-slate-300" />
                )}
              </div>
              <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera size={18} />
              </label>
              <input 
                id="photo-upload" 
                name="photo"
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handlePhotoChange} 
                required 
              />
            </div>
            <span className="text-sm font-medium text-slate-500">Upload Professional Photo</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">First Name</label>
              <input type="text" name="firstName" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="John" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Surname</label>
              <input type="text" name="surname" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Father&apos;s Name</label>
              <input type="text" name="fatherName" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="Robert Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mother&apos;s Name</label>
              <input type="text" name="motherName" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="Mary Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
              <input type="date" name="dob" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Passport Number</label>
              <input type="text" name="passportNo" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none uppercase" placeholder="A1234567" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
              <input type="tel" name="mobile" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="+1 234 567 890" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="john.doe@example.com" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Lock size={16} className="text-slate-400" />
                Password
              </label>
              <input type="password" name="password" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="Create a secure password" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" />
                Full Address
              </label>
              <textarea name="address" required rows={3} className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none" placeholder="123 Main St, Apt 4B, City, Country" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Briefcase size={16} className="text-slate-400" />
                Position Applied For
              </label>
              <select name="jobAppliedFor" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700">
                <option value="">Select a role...</option>
                {JOB_CATEGORIES.map((group, index) => (
                  <optgroup key={index} label={group.category}>
                    {group.roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Country of Application</label>
              <select name="countryAppliedFor" required className="w-full px-4 py-3 rounded-xl bg-slate-100/50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-slate-700">
                <option value="">Select country...</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6">
            <button disabled={isLoading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2">
              <UploadCloud size={20} />
              {isLoading ? "Submitting Application..." : "Submit Application & Generate CV"}
            </button>
            <p className="text-center text-slate-400 text-sm mt-4">
              By submitting, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
