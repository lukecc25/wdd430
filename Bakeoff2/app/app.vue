<template>
  <div class="container">
    <header class="app-header">
      <h1>🍳 CookQuest</h1>
      <div class="auth-actions">
        <ClerkLoading>
          <span class="muted">…</span>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </ClerkLoaded>
      </div>
    </header>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>
