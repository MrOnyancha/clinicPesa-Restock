
import LoginForm from "../../components/Auth/LoginForm/LoginForm";
import { useLoginVerification } from "../../utils/useLoginVerification";


export const Login = () => {
  const loginMutation = useLoginVerification();

  const handleSubmit = (formData: { accountId: string; password: string }) => {
    console.log('Logging in with:', formData);
    loginMutation.mutate(formData);
  };
  return (
    <section
      className="min-h-screen w-full bg-cover bg-center flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: 'url("/images/web-2.webp")' }}
    >
      {/* Logo Card */}
      <div className="p-6 rounded-lg shadow-md mb-8 w-full max-w-xs sm:max-w-sm flex justify-center">
        <img src="/images/logo__.png" alt="clinicpesa logo" className="h-20 sm:h-24 w-auto" />
      </div>

      {/* Login Form Container */}
      <div className="w-full max-w-md bg-[#e1f3fe] rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-6 sm:p-8">
        <h1 className="text-xl font-bold text-[#c0272d] dark:text-white mb-4 text-center">
          Sign into your account
        </h1>
        <LoginForm
          isLoading={loginMutation.isPending}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default Login;