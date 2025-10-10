import {
  type RegisterFormData,
  registerFormSchema,
} from './register-form.schema';

describe('registerFormSchema', () => {
  it('should validate a valid form with matching passwords', () => {
    const validData: RegisterFormData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'password123',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should fail validation for invalid email format', () => {
    const invalidData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'password123',
      email: 'invalid-email',
    };

    const result = registerFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'invalid_format',
          format: 'email',
          path: ['email'],
          message: 'Invalid email address',
        }),
      );
    }
  });

  it('should fail validation when passwords do not match', () => {
    const mismatchedData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'differentpassword',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(mismatchedData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'custom',
          path: ['confirm'],
          message: "Password don't match",
        }),
      );
    }
  });

  it('should fail validation for missing username', () => {
    const missingUsernameData = {
      password: 'password123',
      confirm: 'password123',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(missingUsernameData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'invalid_type',
          path: ['username'],
          message: 'Invalid input: expected string, received undefined',
        }),
      );
    }
  });

  it('should fail validation for missing password', () => {
    const missingPasswordData = {
      username: 'testuser',
      confirm: 'password123',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(missingPasswordData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'invalid_type',
          path: ['password'],
          message: 'Invalid input: expected string, received undefined',
        }),
      );
    }
  });

  it('should fail validation for missing confirm password', () => {
    const missingConfirmData = {
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(missingConfirmData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'invalid_type',
          path: ['confirm'],
          message: 'Invalid input: expected string, received undefined',
        }),
      );
    }
  });

  it('should fail validation for missing email', () => {
    const missingEmailData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'password123',
    };

    const result = registerFormSchema.safeParse(missingEmailData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          code: 'invalid_type',
          path: ['email'],
          message: 'Invalid input: expected string, received undefined',
        }),
      );
    }
  });

  it('should allow empty strings for username and password fields', () => {
    const emptyStringsData = {
      username: '',
      password: '',
      confirm: '',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(emptyStringsData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(emptyStringsData);
    }
  });

  it('should validate complex email formats', () => {
    const complexEmailData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'password123',
      email: 'user.name+tag@example-domain.co.uk',
    };

    const result = registerFormSchema.safeParse(complexEmailData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user.name+tag@example-domain.co.uk');
    }
  });

  it('should maintain field types after validation', () => {
    const validData = {
      username: 'testuser',
      password: 'password123',
      confirm: 'password123',
      email: 'test@example.com',
    };

    const result = registerFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(typeof result.data.username).toBe('string');
      expect(typeof result.data.password).toBe('string');
      expect(typeof result.data.confirm).toBe('string');
      expect(typeof result.data.email).toBe('string');
    }
  });
});
