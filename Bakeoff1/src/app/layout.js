import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import './globals.css';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'CookQuest',
  description: 'Bite-sized cooking lessons with score tracking.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <div className="container">
            <header className="app-header">
              <h1>🍳 CookQuest</h1>
              <div className="auth-actions">
                <Show when="signed-out">
                  <SignInButton />
                  <SignUpButton />
                </Show>
                <Show when="signed-in">
                  <UserButton />
                </Show>
              </div>
            </header>
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
