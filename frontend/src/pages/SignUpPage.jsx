import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });

 
  const signup = useAuthStore((state) => state.signup);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.fullname.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm() !== true) return;

    const payload = {
      name: formData.fullname,
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
    };

   
    console.log(" Submitting signup form...");
    console.log("Payload being sent to backend:", payload);
    console.log("Signup function type:", typeof signup);

    try {
      const res = await signup(payload); 
      console.log(" Signup response from backend:", res);

      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error(" Signup error (page):", err);
      if (err.response) {
        console.error(" Error response data:", err.response.data);
        console.error(" Error status:", err.response.status);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-base-content/60">Get started with your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <div className="flex items-center gap-4">
              <label className="w-28 font-medium text-right">Full Name</label>
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="John Doe"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <div className="flex items-center gap-4">
              <label className="w-28 font-medium text-right">Email</label>
              <input
                type="email"
                className="input input-bordered flex-1"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <div className="flex items-center gap-4">
              <label className="w-28 font-medium text-right">Password</label>
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full bg-blue-600 flex items-center justify-center gap-2"
            disabled={isSigningUp}
            aria-busy={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
