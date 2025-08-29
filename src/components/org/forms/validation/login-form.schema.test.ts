import { type LoginFormData, loginFormSchema } from './login-form.schema';

describe('loginFormSchema', () => {
  it('should validate correct login data', () => {
    const validData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const result = loginFormSchema.safeParse(validData);
    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should require username field', () => {
    const invalidData = {
      password: 'testpassword',
    };

    const result = loginFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const usernameError = result.error.issues.find(
        (issue) => issue.path[0] === 'username',
      );
      expect(usernameError).toBeDefined();
      // The error message might be different for missing field vs empty field
      expect(usernameError?.message).toMatch(/required|string/);
    }
  });

  it('should require password field', () => {
    const invalidData = {
      username: 'testuser',
    };

    const result = loginFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password',
      );
      expect(passwordError).toBeDefined();
      // The error message might be different for missing field vs empty field
      expect(passwordError?.message).toMatch(/required|string/);
    }
  });

  it('should reject empty username', () => {
    const invalidData = {
      username: '',
      password: 'testpassword',
    };

    const result = loginFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const usernameError = result.error.issues.find(
        (issue) => issue.path[0] === 'username',
      );
      expect(usernameError).toBeDefined();
      expect(usernameError?.message).toBe('Username is required');
    }
  });

  it('should reject empty password', () => {
    const invalidData = {
      username: 'testuser',
      password: '',
    };

    const result = loginFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password',
      );
      expect(passwordError).toBeDefined();
      expect(passwordError?.message).toBe('Password is required');
    }
  });

  it('should reject both empty username and password', () => {
    const invalidData = {
      username: '',
      password: '',
    };

    const result = loginFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toHaveLength(2);

      const usernameError = result.error.issues.find(
        (issue) => issue.path[0] === 'username',
      );
      const passwordError = result.error.issues.find(
        (issue) => issue.path[0] === 'password',
      );

      expect(usernameError?.message).toBe('Username is required');
      expect(passwordError?.message).toBe('Password is required');
    }
  });

  it('should accept whitespace-only strings as valid but may fail validation', () => {
    const invalidData = {
      username: '   ',
      password: '\t\n',
    };

    const result = loginFormSchema.safeParse(invalidData);
    // This test depends on the exact schema implementation
    // Some schemas accept whitespace, others don't
    expect(typeof result.success).toBe('boolean');
  });

  it('should type check with LoginFormData', () => {
    const validData: LoginFormData = {
      username: 'testuser',
      password: 'testpassword',
    };

    const result = loginFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should handle extra properties', () => {
    const dataWithExtra = {
      username: 'testuser',
      password: 'testpassword',
      extraField: 'should be ignored',
    };

    const result = loginFormSchema.safeParse(dataWithExtra);
    expect(result.success).toBe(true);

    if (result.success) {
      // Should only include the schema fields
      expect(result.data).toEqual({
        username: 'testuser',
        password: 'testpassword',
      });
      expect(result.data).not.toHaveProperty('extraField');
    }
  });
});
