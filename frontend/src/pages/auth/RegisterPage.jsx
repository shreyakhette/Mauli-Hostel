import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import {
  User,
  GraduationCap,
  HeartHandshake,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import CollegeLogo from '../../components/common/CollegeLogo';

export const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    bloodGroup: 'B+',
    // Step 2: Academic
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    academicYear: '1st Year',
    college: 'Mauli Group of Institutions College of Engineering and Technology, Shegaon',
    // Step 3: Guardian
    guardianName: '',
    guardianContact: '',
    guardianRelationship: 'Father',
    emergencyContact: '',
    address: '',
    // Step 4: Account
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
      if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    } else if (currentStep === 2) {
      if (!formData.department.trim()) newErrors.department = 'Department is required';
      if (!formData.course.trim()) newErrors.course = 'Course is required';
      if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic year is required';
      if (!formData.college.trim()) newErrors.college = 'College name is required';
    } else if (currentStep === 3) {
      if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required';
      if (!formData.guardianContact.trim()) newErrors.guardianContact = 'Guardian contact number is required';
      if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    } else if (currentStep === 4) {
      if (!formData.username.trim()) newErrors.username = 'Username is required';
      else if (formData.username.length < 3) newErrors.username = 'Minimum 3 characters';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const authData = await register(formData);
      toast.success(`Registration successful! Welcome, ${authData.fullName}!`);
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      setStep(4); // return to account step to adjust username/email
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Academic', icon: GraduationCap },
    { num: 3, label: 'Guardian', icon: HeartHandshake },
    { num: 4, label: 'Account', icon: KeyRound },
    { num: 5, label: 'Complete', icon: CheckCircle2 },
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const academicYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
  const relationships = ['Father', 'Mother', 'Legal Guardian', 'Uncle/Aunt', 'Other'];

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <Link to="/login" className="inline-flex items-center gap-3 mb-3 group">
          <CollegeLogo size="md" />
          <div className="text-left">
            <span className="text-lg font-serif font-bold text-slate-900 tracking-tight block">
              Sakhi Girls Hostel
            </span>
            <span className="text-[11px] font-medium text-slate-500 block">
              MGICOET Shegaon • Resident Admission
            </span>
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
          Student Resident Registration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete your 5-step registration to receive your student digital ID and room assignment
        </p>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="w-full max-w-2xl mb-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-wine-900 -z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;

            return (
              <div key={s.num} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-sm ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-wine-900 text-white ring-4 ring-wine-100'
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] font-bold mt-2 hidden sm:block ${
                    isCurrent ? 'text-wine-950' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Wizard Card */}
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-card border border-gray-100">
        {/* Step 1: Personal */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              Step 1: Personal Information
            </h3>

            <Input
              label="Full Name (as per college ID)"
              name="fullName"
              required
              placeholder="e.g. Ananya Sharma"
              value={formData.fullName}
              error={errors.fullName}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="ananya@example.com"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
              />

              <Input
                label="Mobile Number"
                name="mobile"
                required
                placeholder="+91 98765 43210"
                value={formData.mobile}
                error={errors.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                options={bloodGroups}
                value={formData.bloodGroup}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 2: Academic */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              Step 2: Academic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department / Branch"
                name="department"
                required
                placeholder="e.g. Computer Science"
                value={formData.department}
                error={errors.department}
                onChange={handleChange}
              />

              <Input
                label="Course"
                name="course"
                required
                placeholder="e.g. B.Tech / B.E. / MCA"
                value={formData.course}
                error={errors.course}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Academic Year"
                name="academicYear"
                required
                options={academicYears}
                value={formData.academicYear}
                error={errors.academicYear}
                onChange={handleChange}
              />

              <Input
                label="College / Institute Name"
                name="college"
                required
                placeholder="Government College of Engineering"
                value={formData.college}
                error={errors.college}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 3: Guardian */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              Step 3: Guardian Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Guardian Full Name"
                name="guardianName"
                required
                placeholder="e.g. Suresh Sharma"
                value={formData.guardianName}
                error={errors.guardianName}
                onChange={handleChange}
              />

              <Select
                label="Relationship"
                name="guardianRelationship"
                options={relationships}
                value={formData.guardianRelationship}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Guardian Contact Number"
                name="guardianContact"
                required
                placeholder="+91 98765 43210"
                value={formData.guardianContact}
                error={errors.guardianContact}
                onChange={handleChange}
              />

              <Input
                label="24x7 Emergency Contact"
                name="emergencyContact"
                required
                placeholder="+91 98765 43211"
                value={formData.emergencyContact}
                error={errors.emergencyContact}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">
                Permanent Home Address
              </label>
              <textarea
                name="address"
                rows={2}
                placeholder="House no., street, city, state, pin code..."
                value={formData.address}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-wine-800/20 focus:border-wine-800 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Account */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">
              Step 4: Account Credentials
            </h3>

            <Input
              label="Choose Username"
              name="username"
              required
              placeholder="e.g. ananya_s"
              value={formData.username}
              error={errors.username}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={formData.password}
                error={errors.password}
                onChange={handleChange}
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                error={errors.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Review & Confirm Registration
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Please verify your details before submitting to Warden Kranti Bhoyar
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-50 border border-gray-100 space-y-3 text-xs">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Resident Name:</span>
                <span className="font-bold text-gray-900">{formData.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Contact:</span>
                <span className="font-bold text-gray-900">{formData.email} • {formData.mobile}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Academic Program:</span>
                <span className="font-bold text-gray-900">{formData.course} ({formData.department}) • {formData.academicYear}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-medium">Guardian:</span>
                <span className="font-bold text-gray-900">{formData.guardianName} ({formData.guardianContact})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Portal Username:</span>
                <span className="font-bold text-wine-900 font-mono">{formData.username}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-wine-50 text-wine-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-wine-700 flex-shrink-0" />
              <span>An available bed will be automatically allocated to your profile upon completion.</span>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-6">
          {step > 1 ? (
            <Button
              variant="outline"
              size="md"
              icon={ArrowLeft}
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold text-gray-500 hover:text-wine-900"
            >
              Back to Login
            </Link>
          )}

          {step < 5 ? (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={handleNext}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="rose"
              size="md"
              isLoading={loading}
              onClick={handleFinalSubmit}
            >
              Complete Registration
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
