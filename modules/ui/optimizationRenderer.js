import { createCardLink } from '../components/CardLink.js';
import { getCard } from '../cards.js';

/**
 * Renders the optimization section (card upgrades).
 * @param {Object} data - Deck JSON with optimization.cards
 */
export async function renderOptimization(data, cardList = []) {
    const container = document.getElementById("optimizationContainer");
    if (!data.optimization?.cards || data.optimization.cards.length === 0) {
        container.style.display = "none";
        return;
    }

    container.innerHTML = "";

    await data.optimization.cards.forEach(async opt =>  {
        const block = document.createElement("div");
        block.className = "optimization-block";

        const cards = document.createElement("div");
        cards.className = "optimization-cards";

        console.log(`${opt.add}/${opt.addBudget}/${opt.remove}`);

        const addCard = await getCard(opt.add);
        const addBudgetCard = await getCard(opt.addBudget);
        const removeCard = await getCard(opt.remove);

        const add = createCardLink(addCard);
        const addBudget = createCardLink(addBudgetCard);
        const remove = createCardLink(removeCard);

        const arrow = document.createElement("span");
        arrow.textContent = " → ";
        arrow.className = "optimization-arrow";

        cards.appendChild(remove);
        cards.appendChild(arrow);
        cards.appendChild(add);
        cards.append(" ( Budget: ")
        cards.appendChild(addBudget)
        cards.append(" )")

        const reason = document.createElement("div");
        reason.className = "optimization-reason";
        reason.textContent = opt.reason;

        block.appendChild(cards);
        block.appendChild(reason);
        container.appendChild(block);
    });
}
