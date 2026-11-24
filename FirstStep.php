<section id="s1" class="screen active" aria-label="Welcome">
  <p class="brand">FEEDBACK SHIELD</p>
  <h1>Speak freely.<br>Comment responsibly.</h1>
  <p class="lead">Your words matter. Check your comment before you post so every word counts.</p>

  <div class="hero" aria-hidden="true">
    <svg viewBox="0 0 64 64" fill="none" stroke="#67d8f2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M32 6l20 8v16c0 13-8 23-20 28C20 53 12 43 12 30V14l20-8z"/>
      <path d="M23 32l7 7 12-14"/>
    </svg>
  </div>

  <div class="name-field">
    <label for="userName">Your name</label>
    <input id="userName" type="text" maxlength="50" placeholder="Type your name here..." autocomplete="off">
    <p id="nameError" class="name-error" role="alert"></p>
  </div>

  <div class="spacer"></div>
  <button class="btn btn-primary" onclick="startApp()">Start</button>
  <p class="footer-note">Building a safer space for every voice</p>
</section>