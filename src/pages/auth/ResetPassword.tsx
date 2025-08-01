import clinicpesaLogo from '/assets/logo.png';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as Yup from 'yup';

import { useState } from 'react';
import { RiLockPasswordLine } from 'react-icons/ri';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { usePatchRawData } from '@/services/httphandler';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  let token = searchParams.get('t_k') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Too Short!').max(50, 'Too Long!').required('*Password Is Required'),
    newpassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], '*Passwords must match')
      .required('*Password Is Required'),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      password: '',
      newpassword: '',
    },
    validationSchema,
    onSubmit: async ({ password, newpassword }) => {
      setIsLoading(true);

      const { mutate } = usePatchRawData();

      mutate(
        { url: 'admin/resetPassword', data: { newPassword: password, confirmPassword: newpassword }, token },
        {
          onSuccess: (data: any) => {
            if (data && data?.code === 1) {
              toast.success(data?.message);
              navigate(`/auth/`, { replace: true });
              setIsLoading(false);
            } else {
              toast.error(data?.message);
              setIsLoading(false);
            }
          },
          onError: (error: any) => {
            toast.error(error?.message || 'An error occurred');
            setIsLoading(false);
          },
        },
      );
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center  justify-center px-6 py-8 mx-auto  md:h-screen lg:py-0">
        <div>
          <img src={clinicpesaLogo} className="h-[110px] mt-6 md:h-24 md:w-auto" alt="clinicpesa logo" />
        </div>
        <div className="w-[640px] bg-[#e1f3fe] rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-[#c0272d] md:text-2xl dark:text-white">
              Reset Password
            </h1>
            <p>Please reset your password</p>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#495c67] dark:text-white">
                  Password
                </label>
                <div className="flex items-center relative bg-gray-50 border border-gray-300 rounded-lg focus-within:border-[#00bed7]">
                  <span className="pl-4">
                    <RiLockPasswordLine color="#495c675b" className="h-6 w-6 pt-1" />
                  </span>
                  <input
                    value={values.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 text-[#495c67] sm:text-sm rounded-lg focus:outline-none  block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <span onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <IoEyeOff className="absolute text-[#495c67] right-3 cursor-pointer hover:text-[#495c675b] top-3" />
                    ) : (
                      <IoEye className="absolute text-[#495c67] right-3 cursor-pointer hover:text-[#495c675b] top-3" />
                    )}
                  </span>
                </div>
                <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {touched['password'] && errors['password']}
                </span>
              </div>
              <div>
                <label htmlFor="newpassword" className="block mb-2 text-sm font-medium text-[#495c67] dark:text-white">
                  Confirm Password
                </label>
                <div className="flex items-center relative bg-gray-50 border border-gray-300 rounded-lg focus-within:border-[#00bed7]">
                  <span className="pl-4">
                    <RiLockPasswordLine color="#495c675b" className="h-6 w-6 pt-1" />
                  </span>
                  <input
                    value={values.newpassword}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    name="newpassword"
                    id="newpassword"
                    placeholder="••••••••"
                    className="bg-gray-50 text-[#495c67] sm:text-sm rounded-lg focus:outline-none  block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                  <span onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <IoEyeOff className="absolute text-[#495c67] right-3 cursor-pointer hover:text-[#495c675b] top-3" />
                    ) : (
                      <IoEye className="absolute text-[#495c67] right-3 cursor-pointer hover:text-[#495c675b] top-3" />
                    )}
                  </span>
                </div>
                <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {touched['newpassword'] && errors['newpassword']}
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className=" text-white bg-[#00bed7] hover:bg-[#00bed7cc] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isLoading ? 'Submitting...' : 'Done'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
