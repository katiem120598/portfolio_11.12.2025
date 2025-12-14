document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = modal?.querySelector('.modal-close');

    if (!modal || !modalBody) return;

    function stopModalMedia() {
        // Stop local HTML5 media
        modalBody.querySelectorAll("video, audio").forEach((m) => {
            try { m.pause(); } catch (e) {}
            m.currentTime = 0;
            m.src = "";      // extra hard stop (esp. Safari)
            m.load?.();
        });

        // Stop YouTube/Vimeo iframes by resetting src
        modalBody.querySelectorAll("iframe").forEach((f) => {
            const src = f.getAttribute("src");
            if (src) f.setAttribute("src", src);
        });

        // Optional: clear DOM so nothing can keep playing
        modalBody.innerHTML = "";
    }


    document.querySelectorAll('.filler-container').forEach(item => {
        const title = item.dataset.projectTitle || "project";
        const desc  = item.dataset.projectDesc  || "";
        const link  = item.dataset.projectLink  || null;
        const linktitle = item.dataset.projectLinktitle || null;

        // 🔹 skills now defined *per item*
        const skills = item.dataset.projectSkills
            ? item.dataset.projectSkills.split(',').map(s => s.trim())
            : [];

        const modalImgSrc = item.dataset.projectModalImg  || null;
        const modalImgAlt = item.dataset.projectModalAlt  || "";
        const modalScale  = item.dataset.projectModalScale || null;

        const fallbackImg = item.querySelector('img');
        const fallbackSrc = fallbackImg?.getAttribute('src');
        const fallbackAlt = fallbackImg?.getAttribute('alt') || "";

        item.addEventListener('click', (e) => {
            e.preventDefault();

            modalBody.innerHTML = `
                <div class="modal-body">
                    <h2>${title}</h2>

                    ${
                        skills.length
                        ? `<div class="skills-list">
                               ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                           </div>`
                        : ''
                    }

                    <p style="margin: 20px auto;">${desc}</p>


                    ${
                        // PRIORITY 1 — local .mov/.mp4 video
                        item.dataset.projectModalLocalvideo
                        ? `
                            <video 
                                src="${item.dataset.projectModalLocalvideo}"
                                controls autoplay loop playsinline
                                style="
                                    width:${modalScale ? modalScale + '%' : '100%'};
                                    height:auto;
                                    display:block;
                                    margin:20px auto;
                                    border-radius:12px;
                                "
                            ></video>
                        `
                        // PRIORITY 2 — YouTube / iframe video
                        : item.dataset.projectModalVideo
                        ? `
                            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin:20px 0;">
                                <iframe 
                                    src="${item.dataset.projectModalVideo}"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen
                                    style="position:absolute; top:0; left:0; width:100%; height:100%;">
                                </iframe>
                            </div>
                        `
                        // fallback stays the same — DO NOT REMOVE
                        : (

                            modalImgSrc
                            ? `<img src="${modalImgSrc}"
                                    alt="${modalImgAlt}"
                                    style="width:${modalScale ? modalScale + '%' : '100%'}; height:auto; display:block; margin:20px auto;">`
                            : (fallbackSrc
                                ? `<img src="${fallbackSrc}"
                                        alt="${fallbackAlt}"
                                        style="width:${modalScale ? modalScale + '%' : '100%'}; height:auto; display:block; margin:20px auto;">`
                                : ''
                            )
                        )
                    }



                    ${
                        link
                        ? `<a href="${link}" target="_blank" rel="noopener noreferrer">
                               ${linktitle}
                           </a>`
                        : ''
                    }
                </div>
            `;

            modal.showModal();
            closeBtn?.focus();
        });
    });

    // close behaviors
    closeBtn?.addEventListener('click', () => {
        stopModalMedia();
        modal.close();
    });

    modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        stopModalMedia();
        modal.close();
    }
    });

    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) {
        stopModalMedia();
        modal.close();
    }
    });

    modal.addEventListener('close', stopModalMedia);
});
