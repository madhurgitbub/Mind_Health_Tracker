/* ============================================================
   MindScore — validation.js
   Responsible ONLY for validating the prediction form.
   No API calls, no DOM writes outside error/label helpers.
   ============================================================ */

const MindScoreValidation = (() => {

  const RULES = {
    Age:                       { type: 'number', min: 10,  max: 100, message: 'Enter an age between 10 and 100.' },
    Gender:                    { type: 'select', message: 'Please select a gender.' },
    Country:                   { type: 'select', message: 'Please select a country.' },
    Academic_Level:            { type: 'select', message: 'Please select an academic level.' },
    Most_Used_Platform:        { type: 'select', message: 'Please select a platform.' },
    Purpose_Of_Use:            { type: 'select', message: 'Please select a purpose.' },
    Avg_Daily_Usage_Hours:     { type: 'number', min: 0, max: 24, message: 'Enter hours between 0 and 24.' },
    Daily_Unlocks:             { type: 'integer', min: 0, message: 'Enter a positive whole number.' },
    Study_Hours:               { type: 'number', min: 0, max: 24, message: 'Enter hours between 0 and 24.' },
    Physical_Activity_Hours:   { type: 'number', min: 0, max: 24, message: 'Enter hours between 0 and 24.' },
    Sleep_Hours_Per_Night:     { type: 'number', min: 0, max: 24, message: 'Enter hours between 0 and 24.' },
    Stress_Level:              { type: 'select', message: 'Please select a stress level.' },
  };

  /**
   * Validate a single field's raw string value against its rule.
   * Returns { valid: boolean, message: string }
   */
  function validateField(name, rawValue) {
    const rule = RULES[name];
    if (!rule) return { valid: true, message: '' };

    const value = (rawValue ?? '').toString().trim();

    if (value === '') {
      return { valid: false, message: 'This field is required.' };
    }

    if (rule.type === 'select') {
      return { valid: true, message: '' };
    }

    if (rule.type === 'number' || rule.type === 'integer') {
      const num = Number(value);
      if (Number.isNaN(num)) {
        return { valid: false, message: 'Please enter a valid number.' };
      }
      if (rule.type === 'integer' && !Number.isInteger(num)) {
        return { valid: false, message: 'Please enter a whole number.' };
      }
      if (rule.min !== undefined && num < rule.min) {
        return { valid: false, message: rule.message };
      }
      if (rule.max !== undefined && num > rule.max) {
        return { valid: false, message: rule.message };
      }
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate the whole form. Accepts a plain object of field values.
   * Returns { valid: boolean, errors: { [field]: message } }
   */
  function validateForm(values) {
    const errors = {};
    let valid = true;

    Object.keys(RULES).forEach((name) => {
      const result = validateField(name, values[name]);
      if (!result.valid) {
        valid = false;
        errors[name] = result.message;
      }
    });

    return { valid, errors };
  }

  return { RULES, validateField, validateForm };
})();
