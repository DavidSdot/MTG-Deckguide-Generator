let globalPreview; // Für „nur 1 Bild gleichzeitig“
let hoverTimeout;  // Für Verzögerung

export function linkCardNames(text, cards) {
    const pattern = new RegExp(`(${cards.map((card) => card.name + (card.printed_name ? "|" + card.printed_name : "")).join('|')})`, 'g');
    return text.replace(pattern, (match) => {
        const card = cards.find(c => c.name === match || c.printed_name === match)
        const img = card.image_uris?.normal;
        const name = card.printed_name ? card.printed_name : card.name;
        return `<a href="${card.scryfall_uri}" class="cardlink" data-name="${match}" data-image="${img}" target="_blank">${name}</a>`;
    });
}
// Aktiviert Mouseover-Vorschau für alle Links mit .cardlink
export function enableCardHoverLinks(root = document) {
    root.querySelectorAll('a.cardlink').forEach(link => {
        const preview = document.createElement("div");
        preview.className = "card-hover-preview";

        preview.innerHTML = `<img src="${link.dataset.image}" alt="${link.dataset.name}" />`;

        link.addEventListener('mouseenter', () => {
            if (window.innerWidth < 768) return;
            hoverTimeout = setTimeout(() => {
                if (globalPreview && document.body.contains(globalPreview)) {
                    document.body.removeChild(globalPreview);
                }
                globalPreview = preview;
                document.body.appendChild(preview);
            }, 150);
        });

        link.addEventListener('mousemove', e => {
            const previewWidth = 220;
            const offset = 16;
            let left = e.clientX + offset;
            let top = e.clientY + offset;
            if (left + previewWidth > window.innerWidth) {
                left = e.clientX - previewWidth - offset;
            }
            preview.style.position = "fixed";
            preview.style.left = `${left}px`;
            preview.style.top = `${top}px`;
        });

        link.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (globalPreview && document.body.contains(globalPreview)) {
                document.body.removeChild(globalPreview);
                globalPreview = null;
            }
        });
    });
}
