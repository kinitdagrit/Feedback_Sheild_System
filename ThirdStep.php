<section id="s3" class="screen" aria-label="Comment checker">
  <p class="brand">FEEDBACK SHIELD</p>

  <div class="card">
    <h2>Think before you type</h2>
    <p class="sub">Your words have power.</p>

    <div class="gauge">
      <div class="gauge-top"><span>Empathy scan gauge</span><span id="gaugeState" class="gauge-state">Ready to scan</span></div>
      <div class="track"><div id="gaugeFill" class="fill"></div></div>
    </div>

    <div class="field-label"><span>Tap a sample comment</span></div>
    <div class="chips">
      <button class="chip" onclick="useSample('good')">Good word</button>
      <button class="chip" onclick="useSample('positive')">Positive</button>
      <button class="chip" onclick="useSample('harmful')">Harmful</button>
    </div>

    <div class="field-label"><label for="comment">Enter your comment</label><span id="count" class="count">0 / 280</span></div>
    <textarea id="comment" maxlength="280" placeholder="Type your comment here..."></textarea>

    <button id="checkButton" class="btn btn-blue" onclick="checkMyComment()">Check comment</button>

    <div id="result" class="result" role="status" aria-live="polite"></div>

    <div id="actions" class="stack hidden">
      <button id="reviseButton" class="btn btn-ghost hidden" style="background:#eef1fa;color:var(--navy-700);border-color:var(--line)" onclick="reviseComment()">Revise comment</button>
      <button id="continueButton" class="btn btn-primary hidden" onclick="finish()">Continue</button>
    </div>

    <p class="hint">Choose words that promote respect and kindness.</p>
  </div>

  <div class="spacer"></div>
  <div class="bar">
    <button class="link" onclick="go(2)">Back</button>
    <div class="dots" aria-hidden="true"><span class="dot"></span><span class="dot"></span><span class="dot on"></span><span class="dot"></span></div>
    <span style="min-width:64px"></span>
  </div>
</section>
