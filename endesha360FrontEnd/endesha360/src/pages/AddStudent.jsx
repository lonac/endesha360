import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { User, Mail, Phone } from 'lucide-react';

const AddStudent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { addStudent, error, loading } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = React.useState({ show: false, message: '', type: 'error' });

  const onSubmit = async (data) => {
    try {
      await addStudent(data);
      setAlert({ show: true, message: 'Student added successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setAlert({ show: true, message: err.message || 'Failed to add student.', type: 'error' });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">Add New Student</h1>
            <p className="mt-1 text-sm text-gray-600">Enter the details of the new student below.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="p-6 space-y-6">
              {alert.show && <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">Student Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    type="text"
                    register={register}
                    validation={{ required: 'First name is required' }}
                    error={errors.firstName}
                    icon={User}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    type="text"
                    register={register}
                    validation={{ required: 'Last name is required' }}
                    error={errors.lastName}
                    icon={User}
                  />
                </div>
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  validation={{ required: 'Email is required' }}
                  error={errors.email}
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  register={register}
                  validation={{ required: 'Phone number is required' }}
                  error={errors.phone}
                  icon={Phone}
                />
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Adding Student...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
