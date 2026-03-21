$("video").each(function () {
    if (this.hasAttribute("controls")) {
        $(this).prop("controlslist", "nodownload");
    }
    const observer = new window.IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                if (this.paused) {
                    $(this).prop("muted", true);
                    this.play();
                }
            } else {
                this.pause();
            }
        }, {
        threshold: 0.5,
    }
    );
    observer.observe(this);
});
