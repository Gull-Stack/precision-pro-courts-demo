// ── Precision Pro Courts Chatbot ──
(function() {
  const responses = {
    quote: "We'd love to give you a free quote! 📋 You can:\n\n• Call/text us anytime\n• Email precisionprocourts@gmail.com\n• Fill out our <a href='contact.html'>contact form</a>\n\nWe'll get back to you within 24 hours with a detailed, no-obligation estimate!",
    sports: "We build courts for multiple sports! 🏆\n\n🏓 <b>Pickleball</b> — America's fastest-growing sport\n🎾 <b>Tennis</b> — New builds & resurfacing\n🏀 <b>Basketball</b> — Custom sizes & colors\n🎨 <b>Multi-Sport</b> — Combination courts\n🔧 <b>Resurfacing</b> — Restore existing courts\n🏗️ <b>Fencing</b> — Court perimeter fencing\n\nVisit our <a href='services.html'>services page</a> for details!",
    areas: "We proudly serve these Utah counties: 📍\n\n• Utah County\n• Salt Lake County\n• Davis County\n• Weber County\n• Juab County\n• Washington County\n\nFrom the Wasatch Front to St. George — we've got you covered!",
    cost: "Court costs vary based on type, size, surface, and features. We're known for <b>beautiful courts at affordable prices</b>. 💰\n\nFor a personalized quote, <a href='contact.html'>contact us</a> — it's free and no-obligation!",
    time: "Most residential courts take <b>2-4 weeks</b> from start to finish. ⏱️\n\nTimeline depends on court size, complexity, and weather. We'll give you a detailed schedule during your free consultation!",
    resurfacing: "Yes! We specialize in court resurfacing. 🔧\n\nWe can restore tennis, basketball, and pickleball courts to like-new condition. It's a cost-effective way to breathe new life into an aging surface.\n\nCheck out our <a href='services/coatings.html'>coatings page</a> for more details!",
    fencing: "We offer professional court fencing solutions! 🏗️\n\nFrom chain-link to vinyl-coated options, we'll match the right fencing to your court and budget.\n\nLearn more on our <a href='services/fencing.html'>fencing page</a>!",
    customize: "Absolutely! We offer full customization: 🎨\n\n• Court colors (choose from dozens of options)\n• Logo integration\n• Custom line markings\n• Multi-sport configurations\n• Various surface textures\n\nOur design process lets you see your vision before we build!",
    permits: "Don't worry about permits — we handle everything! 📄\n\nPermit requirements vary by city and county. Our full-service approach includes managing the entire permitting process for you.",
    process: "Building your dream court is easy! 🏗️\n\n<b>Step 1:</b> Free Consultation — we assess your space & provide a quote\n<b>Step 2:</b> Custom Design — collaborate on layout, colors & features\n<b>Step 3:</b> Expert Build — professional installation with premium materials\n\nReady to start? <a href='contact.html'>Get your free quote!</a>",
    fallback: "Great question! For the best answer, I'd recommend:\n\n📧 Email: precisionprocourts@gmail.com\n📋 <a href='contact.html'>Contact form</a>\n\nOur team typically responds within 24 hours! Is there anything else I can help with?"
  };

  const patterns = [
    { regex: /\b(quote|estimate|pricing|price|free quote)\b/i, key: 'quote' },
    { regex: /\b(what sport|which sport|what do you build|what kind|type of court)\b/i, key: 'sports' },
    { regex: /\b(where|area|serve|location|county|counties|service area|utah|salt lake|davis|weber)\b/i, key: 'areas' },
    { regex: /\b(cost|how much|price|expensive|afford|budget)\b/i, key: 'cost' },
    { regex: /\b(how long|time|timeline|duration|weeks|days)\b/i, key: 'time' },
    { regex: /\b(resurface|resurfacing|repair|restore|refinish)\b/i, key: 'resurfacing' },
    { regex: /\b(fence|fencing|perimeter|chain.?link)\b/i, key: 'fencing' },
    { regex: /\b(custom|color|design|logo|personalize|multi.?sport)\b/i, key: 'customize' },
    { regex: /\b(permit|permission|zoning|city approval)\b/i, key: 'permits' },
    { regex: /\b(process|how does it work|steps|how to start|getting started)\b/i, key: 'process' },
    { regex: /\b(hi|hello|hey|howdy|greetings)\b/i, key: '_greeting' },
  ];

  const greetings = [
    "Hi there! 👋 Welcome to Precision Pro Courts! How can I help you today?",
    "Hello! 🏆 Thanks for reaching out. What can I help you with?",
    "Hey! 👋 I'm here to help with any questions about our court building services!"
  ];

  function getResponse(input) {
    for (const p of patterns) {
      if (p.regex.test(input)) {
        if (p.key === '_greeting') return greetings[Math.floor(Math.random() * greetings.length)];
        return responses[p.key];
      }
    }
    return responses.fallback;
  }

  function addMessage(text, type) {
    const msgs = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = 'chat-msg ' + type;
    msg.innerHTML = text;
    msgs.appendChild(msg);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function handleSend(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    // Hide quick prompts after first interaction
    const prompts = document.querySelector('.chatbot-prompts');
    if (prompts) prompts.style.display = 'none';
    setTimeout(() => addMessage(getResponse(text), 'bot'), 500);
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('chatBubble');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!bubble) return;

    bubble.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      bubble.classList.toggle('open');
      bubble.innerHTML = isOpen ? '✕' : '💬';
      if (isOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
      panel.classList.remove('open');
      bubble.classList.remove('open');
      bubble.innerHTML = '💬';
    });

    sendBtn.addEventListener('click', () => {
      handleSend(input.value);
      input.value = '';
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSend(input.value);
        input.value = '';
      }
    });

    document.querySelectorAll('.chatbot-prompt').forEach(btn => {
      btn.addEventListener('click', () => handleSend(btn.textContent));
    });
  });
})();
