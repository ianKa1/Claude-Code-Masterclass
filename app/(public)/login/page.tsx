import AuthForm from "@/components/forms/AuthForm";

export default function LoginPage() {
  return (
    <div className="auth-page">
      <h2>Log in to Your Account</h2>
      <AuthForm mode="login" />
    </div>
  );
}
