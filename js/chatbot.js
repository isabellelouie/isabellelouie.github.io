(function () {
    var WORKER_URL = 'https://isabelle-portfolio-chat.isabellelouie.workers.dev';

    var CHIPS = [
        { label: '✨ Tell me about yourself', question: 'Tell me about yourself.' },
        { label: 'Which case study should I start with?', question: 'Which case study should I start with?' },
    ];

    var FAB_ICON = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 4.5A2.5 2.5 0 014.5 2h11A2.5 2.5 0 0118 4.5v8a2.5 2.5 0 01-2.5 2.5H6.5L2 18V4.5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
    var SEND_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1L15 8L8 15M15 8H1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function PortfolioChatbot(workerUrl) {
        this.workerUrl = workerUrl;
        this.history = [];
        this.chipsShown = true;
        this.usedChips = new Set();
        this.lastQuestion = null;
        this.isOpen = false;
        this._inject();
        this._attach();
    }

    PortfolioChatbot.prototype._inject = function () {
        // FAB
        var fab = document.createElement('button');
        fab.className = 'cb-fab';
        fab.setAttribute('aria-label', 'Coffee Chat with Isabelle');
        fab.setAttribute('title', 'Coffee Chat with Isabelle');
        fab.innerHTML = FAB_ICON;
        document.body.appendChild(fab);
        this.fab = fab;

        // Panel
        var panel = document.createElement('div');
        panel.className = 'cb-panel';
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = [
            '<div class="cb-header">',
            '  <span class="cb-header-title">Coffee Chat with Isabelle ☕️</span>',
            '  <div class="cb-header-actions">',
            '    <button class="cb-clear" aria-label="Clear chat" title="Clear Chat">',
            '      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13.657 6A6 6 0 1 0 12 12.657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M14 2v4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            '    </button>',
            '    <button class="cb-close" aria-label="Close chat" title="Close">',
            '      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/></svg>',
            '    </button>',
            '  </div>',
            '</div>',
            '<div class="cb-messages" id="cb-messages"></div>',
            '<div class="cb-input-row">',
            '  <input type="text" class="cb-input" id="cb-input" placeholder="Ask me anything…" autocomplete="off">',
            '  <button class="cb-send" id="cb-send" aria-label="Send">' + SEND_ICON + '</button>',
            '</div>',
            '<p class="cb-disclaimer">Powered by AI. Not me, but pretty close.</p>'
        ].join('');
        document.body.appendChild(panel);
        this.panel = panel;
        this.messages = panel.querySelector('#cb-messages');
        this.input = panel.querySelector('#cb-input');
        this.sendBtn = panel.querySelector('#cb-send');

        // Show chips on first open
        this._renderChips();
    };

    PortfolioChatbot.prototype._renderChips = function () {
        var self = this;

        // Intro message
        var intro = document.createElement('div');
        intro.className = 'cb-intro';
        intro.innerHTML = '<p class="cb-intro-sub">Ask me anything about my work, projects, or experience.</p>';
        this.messages.appendChild(intro);

        var wrap = document.createElement('div');
        wrap.className = 'cb-chips';
        wrap.id = 'cb-chips';
        CHIPS.forEach(function (chip) {
            var btn = document.createElement('button');
            btn.className = 'cb-chip';
            btn.textContent = chip.label;
            btn.addEventListener('click', function () {
                self.usedChips.add(chip.label);
                wrap.remove();
                self._send(chip.question);
            });
            wrap.appendChild(btn);
        });
        this.messages.appendChild(wrap);
    };

    PortfolioChatbot.prototype._attach = function () {
        var self = this;

        this.fab.addEventListener('click', function () {
            self.isOpen ? self.close() : self.open();
        });

        this.panel.querySelector('.cb-close').addEventListener('click', function () {
            self.close();
        });

        this.panel.querySelector('.cb-clear').addEventListener('click', function () {
            self.reset();
        });

        this.sendBtn.addEventListener('click', function () {
            self._send(self.input.value);
        });

        this.input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') self._send(self.input.value);
            if (e.key === 'Escape') self.close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && self.isOpen) self.close();
        });
        this.sendBtn.disabled = true;
        this.input.addEventListener('input', function () {
            self.sendBtn.disabled = self.input.value.trim() === '';
        });
    };

    PortfolioChatbot.prototype.reset = function () {
        this.history = [];
        this.chipsShown = true;
        this.usedChips = new Set();
        this.messages.innerHTML = '';
        this._renderChips();
    };

    PortfolioChatbot.prototype.open = function () {
        this.isOpen = true;
        this.panel.classList.add('open');
        this.panel.setAttribute('aria-hidden', 'false');
        this.input.focus();
    };

    PortfolioChatbot.prototype.close = function () {
        this.isOpen = false;
        this.panel.classList.remove('open');
        this.panel.setAttribute('aria-hidden', 'true');
    };

    PortfolioChatbot.prototype._send = function (text) {
        text = (text || '').trim();
        if (!text) return;

        // Hide chips and intro after first message, add timestamp
        if (this.chipsShown) {
            var chips = document.getElementById('cb-chips');
            if (chips) chips.remove();
            var intro = this.messages.querySelector('.cb-intro');
            if (intro) intro.remove();
            this.chipsShown = false;

            // Timestamp
            var ts = document.createElement('div');
            ts.className = 'cb-timestamp';
            ts.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            this.messages.appendChild(ts);
        }

        this.input.value = '';
        this.sendBtn.disabled = true;
        this.lastQuestion = text;

        // User bubble
        var userBubble = this._addBubble(text, 'user', true);

        // Keep last 10 messages in history
        this.history.push({ role: 'user', content: text });
        if (this.history.length > 10) this.history = this.history.slice(-10);

        // Typing indicator
        var typing = document.createElement('div');
        typing.className = 'cb-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        this.messages.appendChild(typing);
        // Don't scroll for typing indicator — user message already scrolled into view

        var self = this;
        var startTime = Date.now();

        fetch(this.workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, history: this.history.slice(0, -1) })
        })
            .then(function (r) { return r.json(); })
            .then(function (d) {
                var reply = d.reply || 'Something went wrong — try again.';
                // Show typing indicator for at least 800ms
                var elapsed = Date.now() - startTime;
                var delay = Math.max(0, 800 - elapsed);
                setTimeout(function () {
                    typing.remove();
                    self._addBubble(reply, 'bot');
                    self.history.push({ role: 'assistant', content: reply });
                    if (self.history.length > 10) self.history = self.history.slice(-10);
                    self._renderFollowUpChips();
                    setTimeout(function () {
                        var container = self.messages;
                        container.scrollTo({ top: userBubble.offsetTop - container.offsetTop, behavior: 'smooth' });
                    }, 0);
                }, delay);
            })
            .catch(function () {
                typing.remove();
                self._addBubble('Something went wrong — try again.', 'bot');
            })
            .finally(function () {
                self.sendBtn.disabled = self.input.value.trim() === '';
                self.input.focus();
            });
    };

    PortfolioChatbot.prototype._addBubble = function (text, role, scrollNow) {
        var bubble = document.createElement('div');
        bubble.className = 'cb-bubble ' + role;

        // Render bullet lines as a proper <ul>
        var lines = text.split('\n');
        var html = '';
        var inList = false;
        lines.forEach(function (line) {
            var isBullet = /^[•\-\*] /.test(line.trim());
            if (isBullet) {
                if (!inList) { html += '<ul>'; inList = true; }
                html += '<li>' + _escHtml(line.trim().replace(/^[•\-\*] /, '')) + '</li>';
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                if (line.trim()) html += '<p>' + _escHtml(line) + '</p>';
            }
        });
        if (inList) html += '</ul>';
        bubble.innerHTML = html;

        this.messages.appendChild(bubble);
        if (scrollNow) {
            var container = this.messages;
            setTimeout(function () {
                container.scrollTo({ top: bubble.offsetTop - container.offsetTop, behavior: 'smooth' });
            }, 0);
        }
        return bubble;
    };

    function _escHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    PortfolioChatbot.prototype._renderFollowUpChips = function () {
        var self = this;
        var existing = document.getElementById('cb-followup-chips');
        if (existing) existing.remove();

        var chipsToShow;
        if (self.lastQuestion === 'Which case study should I start with?') {
            chipsToShow = [
                { label: 'DNA Web UI Kit', question: 'Tell me about the DNA Web UI Kit.' },
                { label: 'Flair Airlines', question: 'Tell me about the Flair Airlines case study.' },
            ];
        } else if (self.lastQuestion === 'Tell me about the DNA Web UI Kit.') {
            chipsToShow = [
                { label: 'What was the biggest challenge?', question: 'What was the biggest challenge on the DNA Web UI Kit?' },
                { label: 'What was the impact?', question: 'What was the impact of the DNA Web UI Kit?' },
            ];
            if (!self.usedChips.has('Flair Airlines')) {
                chipsToShow.push({ label: 'Flair Airlines', question: 'Tell me about the Flair Airlines case study.' });
            }
        } else if (self.lastQuestion === 'What was the biggest challenge on the DNA Web UI Kit?') {
            chipsToShow = [];
            if (!self.usedChips.has('What was the impact?')) {
                chipsToShow.push({ label: 'What was the impact?', question: 'What was the impact of the DNA Web UI Kit?' });
            }
            if (!self.usedChips.has('Flair Airlines')) {
                chipsToShow.push({ label: 'Flair Airlines', question: 'Tell me about the Flair Airlines case study.' });
            }
        } else if (self.lastQuestion === 'What was the impact of the DNA Web UI Kit?') {
            chipsToShow = [];
            if (!self.usedChips.has('What was the biggest challenge?')) {
                chipsToShow.push({ label: 'What was the biggest challenge?', question: 'What was the biggest challenge on the DNA Web UI Kit?' });
            }
            if (!self.usedChips.has('Flair Airlines')) {
                chipsToShow.push({ label: 'Flair Airlines', question: 'Tell me about the Flair Airlines case study.' });
            }
        } else if (self.lastQuestion === 'Tell me about the Flair Airlines case study.') {
            chipsToShow = self.usedChips.has('DNA Web UI Kit') ? [] : [
                { label: 'DNA Web UI Kit', question: 'Tell me about the DNA Web UI Kit.' },
            ];
        } else {
            chipsToShow = CHIPS.filter(function (c) { return !self.usedChips.has(c.label); });
        }

        if (chipsToShow.length === 0) return;

        var wrap = document.createElement('div');
        wrap.className = 'cb-chips cb-followup-chips';
        wrap.id = 'cb-followup-chips';
        chipsToShow.forEach(function (chip) {
            var btn = document.createElement('button');
            btn.className = 'cb-chip';
            btn.textContent = chip.label;
            btn.addEventListener('click', function () {
                self.usedChips.add(chip.label);
                wrap.remove();
                self._send(chip.question);
            });
            wrap.appendChild(btn);
        });
        this.messages.appendChild(wrap);
    };

    PortfolioChatbot.prototype._scrollToBottom = function () {
        // Only auto-scroll if already near the bottom
        var threshold = 80;
        var atBottom = this.messages.scrollHeight - this.messages.scrollTop - this.messages.clientHeight < threshold;
        if (atBottom) {
            this.messages.scrollTop = this.messages.scrollHeight;
        }
    };

    window.PortfolioChatbot = PortfolioChatbot;
})();
