import clinicpesaLogo from '/assets/logo__.png';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { postRawData } from '../../services/httphandler';
import { toast } from 'sonner';
import { MdOutlineEmail } from 'react-icons/md';
import { useState } from 'react';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('*Invalid email').required('*Email is Required'),
  });

  const { values, handleSubmit, touched, errors, handleChange } = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async ({ email }) => {
      setIsLoading(true);

      let response = await postRawData('admin/forgotPassword', { email });
      if (response && response?.code === 1) {
        navigate(`/auth/otp-input?email=${email}`);
        setIsLoading(false);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
        setIsLoading(false);
      }
    },
  });

  return (
    <section className="bg-[url(/assets/web-2.png)] bg-center bg-auto">
      <div className="flex flex-col items-center  justify-center px-6 py-8 mx-auto  md:h-screen lg:py-0">
        <div>
          <img src={clinicpesaLogo} className="h-[110px] mt-6 md:h-24 md:w-auto" alt="clinicpesa logo" />
        </div>
        <div className="w-[640px] bg-[#e1f3fe] rounded-lg shadow dark:border md:mt-0  xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-[#c0272d] md:text-2xl dark:text-white">
              Forgot Password
            </h1>
            <p>Please enter your email address in order to retrieve your password</p>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#495c67] dark:text-white">
                  Your email
                </label>
                <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg focus-within:border-[#00bed7]">
                  <span className="pl-4">
                    <MdOutlineEmail color="#495c675b" className="h-6 w-6 pt-1" />
                  </span>
                  <input
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 text-[#495c67] sm:text-sm rounded-lg focus:outline-none  block w-3/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <span className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {touched['email'] && errors['email']}
                </span>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className=" text-white bg-[#00bed7] hover:bg-[#00bed7cc] hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
