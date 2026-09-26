import { useState, useCallback } from 'react';

/**
 * Custom form hook conforming to Task 7 specifications:
 * Returns: { values, errors, handleChange, handleSubmit, reset, isValid }
 */
export function useForm(initialValues = {}, validateFn = () => ({})) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    // Requirement: Errors clear as soon as the user edits that field
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
  }, [initialValues]);

  const handleSubmit = useCallback((onSubmitCallback) => {
    const validationErrors = validateFn(values);
    setErrors(validationErrors || {});

    const hasErrors = validationErrors && Object.keys(validationErrors).length > 0;
    if (!hasErrors && onSubmitCallback) {
      onSubmitCallback(values);
      return true;
    }
    return false;
  }, [values, validateFn]);

  const isValid = Object.keys(errors).length === 0;

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    isValid,
    setValues,
  };
}

export default useForm;
