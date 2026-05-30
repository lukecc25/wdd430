<template>
  <div class="app-shell">
    <header class="site-header">
      <h1 class="site-header__brand">🍳 CookQuest</h1>
      <div class="auth-actions">
        <ClerkLoading>
          <span class="site-header__loading">…</span>
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

    <div class="container">
      <main>
        <NuxtPage />
      </main>
    </div>
  </div>
</template>
