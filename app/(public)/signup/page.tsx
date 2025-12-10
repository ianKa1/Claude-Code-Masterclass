import AuthForm from "@/components/forms/AuthForm";

export default function SignupPage() {
  return (
    <div className="auth-page">
      <h2>Create Your Account</h2>
      <AuthForm mode="signup" />
    </div>
  );
}
