import type { Meta, StoryObj } from '@storybook/react-vite';

// Create a mock version of the RegisterPage component to avoid hook dependencies
function MockRegisterPage() {
  return (
    <section className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6">
              <div className="leading-none font-semibold">
                Create an account
              </div>
              <div className="text-muted-foreground text-sm">
                Enter your information below to create your account
              </div>
            </div>
            <div className="px-6">
              <form className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <label
                      className="flex items-center gap-2 text-sm leading-none font-medium select-none"
                      htmlFor="username"
                    >
                      Username
                      <span className="ml-1 text-destructive">*</span>
                    </label>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe17"
                    required
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <label
                      className="flex items-center gap-2 text-sm leading-none font-medium select-none"
                      htmlFor="email"
                    >
                      Email
                      <span className="ml-1 text-destructive">*</span>
                    </label>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <label
                      className="flex items-center gap-2 text-sm leading-none font-medium select-none"
                      htmlFor="password"
                    >
                      Password
                      <span className="ml-1 text-destructive">*</span>
                    </label>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2 w-full"
                  >
                    Create Account
                  </button>
                </div>
              </form>

              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const meta = {
  title: 'Pages/RegisterPage',
  component: MockRegisterPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full-page registration layout with centered form card and responsive design.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MockRegisterPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Registration page layout on mobile viewport with proper spacing and touch-friendly elements.',
      },
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Registration page layout on tablet viewport.',
      },
    },
  },
};

export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story: 'Registration page layout on desktop viewport.',
      },
    },
  },
};
