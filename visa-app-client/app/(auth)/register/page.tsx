"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterValues } from "@/schemas/auth.schema";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAlert } from "@/components/ui";
import Link from "next/link";
import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
import { 
  Globe, 
  ArrowRight, 
  ChevronLeft, 
  User, 
  Building2, 
  ShieldCheck, 
  Check,
  Phone,
  Calendar,
  MapPin,
  Mail,
  Lock,
  Flag
} from "lucide-react";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });
  const [registerAgent, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { showAlert } = useAlert();
  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "Elite Visa Hub",
    brandName: "Global Passports & Visas",
    departmentName: "Advanced Immigration Consultants",
  }) as TSiteSettings;

  const onSubmit = async (data: RegisterValues) => {
    const secretQuestions = [
      { question: data.q1, answer: data.a1 },
      { question: data.q2, answer: data.a2 },
      { question: data.q3, answer: data.a3 },
    ].filter((q) => q.question && q.answer);

    const submissionData = {
      ...data,
      name: `${data.givenNames} ${data.familyName}`.trim(),
      secretQuestions,
    };

    try {
      await registerAgent(submissionData).unwrap();

      showAlert({
        title: "Registration Successful",
        message: "Your agent account has been created. You can now log in.",
        type: "success",
      });

      router.push("/login");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };

      showAlert({
        title: "Registration Failed",
        message:
          error?.data?.message || "Registration failed. Please try again.",
        type: "error",
      });
    }
  };

  const validateStep = async () => {
    let fields: (keyof RegisterValues)[] = [];
    if (step === 1) {
      fields = ["givenNames", "familyName", "dateOfBirth", "phone"];
    } else if (step === 2) {
      fields = [
        "companyName",
        "streetAddress",
        "city",
        "stateProvince",
        "zipPostalCode",
        "country",
        "licenseNumber",
      ];
    }

    if (fields.length > 0) {
      const isValid = await trigger(fields);
      return isValid;
    }
    return true;
  };

  const nextStep = async () => {
    const isValid = await validateStep();
    if (isValid) {
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { id: 1, name: "Personal", icon: User },
    { id: 2, name: "Organisation", icon: Building2 },
    { id: 3, name: "Security", icon: ShieldCheck }
  ];

  return (
    <div className="bg-[#040d1a] min-h-screen font-sans text-gray-200 flex flex-col relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Globe className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                {siteSettings.siteName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold mt-1">
                {siteSettings.departmentName}
              </span>
            </div>
          </Link>
          <Link 
            href="/login" 
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} /> Back to Login
          </Link>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center px-6 relative z-20 pb-20 mt-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3">Agent Registration</h1>
            <p className="text-gray-400">Join our network of certified global migration partners</p>
          </div>

          {/* Progress Multi-step */}
          <div className="flex items-center justify-between mb-12 max-w-md mx-auto relative">
             <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 -z-10" />
             {steps.map((s, idx) => (
               <div key={s.id} className="flex flex-col items-center gap-3">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                      step > s.id 
                      ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20" 
                      : step === s.id 
                      ? "bg-[#040d1a] border-blue-500 text-blue-400" 
                      : "bg-[#040d1a] border-white/10 text-gray-600"
                    }`}
                  >
                    {step > s.id ? <Check size={20} className="text-white" /> : <s.icon size={20} />}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-black ${step === s.id ? "text-blue-400" : "text-gray-600"}`}>
                    {s.name}
                  </span>
               </div>
             ))}
          </div>

          {/* Form Card */}
          <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <form onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <div className="col-span-1 space-y-2">
                       <label className="text-sm font-bold text-gray-300 ml-1">Title</label>
                       <select
                        {...register("title")}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all appearance-none"
                      >
                        <option value="" className="bg-[#040d1a]">Title</option>
                        <option value="Mr" className="bg-[#040d1a]">Mr</option>
                        <option value="Mrs" className="bg-[#040d1a]">Mrs</option>
                        <option value="Ms" className="bg-[#040d1a]">Ms</option>
                        <option value="Dr" className="bg-[#040d1a]">Dr</option>
                      </select>
                    </div>
                    <div className="col-span-1 sm:col-span-3 space-y-2">
                      <label className="text-sm font-bold text-gray-300 ml-1">Given Names <span className="text-blue-500">*</span></label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                          {...register("givenNames")}
                          type="text"
                          placeholder="First Name"
                          className={`w-full bg-white/5 border ${errors.givenNames ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                        />
                      </div>
                      {errors.givenNames && <p className="text-rose-400 text-xs mt-1 ml-1">{errors.givenNames.message as string}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 ml-1">Family Name <span className="text-blue-500">*</span></label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        {...register("familyName")}
                        type="text"
                        placeholder="Last Name"
                        className={`w-full bg-white/5 border ${errors.familyName ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                      />
                    </div>
                    {errors.familyName && <p className="text-rose-400 text-xs mt-1 ml-1">{errors.familyName.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 ml-1">Date of Birth <span className="text-blue-500">*</span></label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                          {...register("dateOfBirth")}
                          type="date"
                          className={`w-full bg-white/5 border ${errors.dateOfBirth ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-300 ml-1">Phone Number <span className="text-blue-500">*</span></label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                          {...register("phone")}
                          type="text"
                          placeholder="+880..."
                          className={`w-full bg-white/5 border ${errors.phone ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 ml-1">Organisation Account Name <span className="text-blue-500">*</span></label>
                    <div className="relative group">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        {...register("companyName")}
                        type="text"
                        placeholder="Company Name"
                        className={`w-full bg-white/5 border ${errors.companyName ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-300 ml-1">Organisation Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        {...register("streetAddress")}
                        placeholder="Street Address"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        {...register("city")}
                        placeholder="City"
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                      <input
                        {...register("stateProvince")}
                        placeholder="State/Province"
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        {...register("zipPostalCode")}
                        placeholder="Zip/Postcode"
                        className="bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                      <div className="relative group">
                        <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                        <input
                          {...register("country")}
                          placeholder="Country"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-300 ml-1">License Number <span className="text-blue-500">*</span></label>
                       <input
                        {...register("licenseNumber")}
                        placeholder="Agent License"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-300 ml-1">MARN (Optional)</label>
                       <input
                        {...register("marn")}
                        placeholder="Registration No"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300 ml-1">Email address <span className="text-blue-500">*</span></label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="agent@example.com"
                        className={`w-full bg-white/5 border ${errors.email ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pb-6 border-b border-white/5">
                    <label className="text-sm font-bold text-gray-300 ml-1">Account Password <span className="text-blue-500">*</span></label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="••••••••"
                        className={`w-full bg-white/5 border ${errors.password ? "border-rose-500/50" : "border-white/10"} rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all`}
                      />
                    </div>
                  </div>

                  {/* Secret Questions */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                       <ShieldCheck className="text-blue-500" size={20} /> Secret Questions
                    </h3>
                    
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="space-y-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                        <select
                          {...register(`q${num}` as any)}
                          className="w-full bg-transparent border-b border-white/10 py-2 text-sm text-gray-300 outline-none focus:border-blue-500 transition-colors appearance-none"
                        >
                          {num === 1 && (
                            <>
                              <option value="What is your favourite movie?" className="bg-[#040d1a]">Favourite Movie</option>
                              <option value="What was your first pet's name?" className="bg-[#040d1a]">First Pet&apos;s Name</option>
                            </>
                          )}
                          {num === 2 && (
                            <>
                              <option value="What is the name of your favourite teacher?" className="bg-[#040d1a]">Favourite Teacher</option>
                              <option value="What is your mother's maiden name?" className="bg-[#040d1a]">Mother&apos;s Maiden Name</option>
                            </>
                          )}
                          {num === 3 && (
                            <>
                              <option value="Name your favourite holiday destination." className="bg-[#040d1a]">Favourite Holiday</option>
                              <option value="What is your favourite food?" className="bg-[#040d1a]">Favourite Food</option>
                            </>
                          )}
                        </select>
                        <input
                          {...register(`a${num}` as any)}
                          placeholder="Your Answer"
                          className="w-full bg-transparent text-white text-sm outline-none focus:text-blue-400 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center gap-2"
                  >
                    <ChevronLeft size={20} /> Previous
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition flex items-center justify-center text-center"
                  >
                    Cancel
                  </Link>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                  >
                    Continue <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? "Creating Account..." : (
                      <>
                        Create Account <Check size={20} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Simplified Footer */}
      <footer className="py-8 px-6 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Legal</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.brandName}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
